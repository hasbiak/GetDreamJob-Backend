const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('../helper/helper')
const redis = require('redis')
const client = redis.createClient()
const {
  seekerRegisModel,
  loginModel,
  addRecruiterModel,
  addPekerjaModel,
  confirmEmail,
  codeTokenCheckModel,
  getTimeStampDiff,
  editProfilePekerjaModel,
  getProfilePekerjaModel,
  updateTokenForgetPass,
  updatePasswordForgot,
  codeTokenForgotCheckModel,
  changePasswordModel
} = require('../model/user')
const nodemailer = require('nodemailer')
require('dotenv').config()
const fs = require('fs')

module.exports = {
  register: async (req, res) => {
    try {
      const {
        username,
        email_user,
        user_password,
        company_name,
        jabatan,
        phone_number
      } = req.body
      const checkDataLogin = await loginModel(email_user)
      if (checkDataLogin.length >= 1) {
        return helper.response(
          res,
          400,
          `Invalid Register ${email_user}, Your email has already been registered`
        )
      } else {
        const salt = bcrypt.genSaltSync(10)
        const encryptPassword = bcrypt.hashSync(user_password, salt)
        if (username && email_user && user_password && phone_number) {
          if (jabatan && company_name) {
            const setData = {
              username,
              email_user,
              user_password: encryptPassword,
              company_name,
              jabatan,
              phone_number,
              token_confirmEmail: require('crypto')
                .randomBytes(15)
                .toString('hex'),
              roles: 1,
              created_at: new Date()
            }
            const result = await seekerRegisModel(setData)
            const setDataRecruiter = {
              id_recruiter: result.id_user,
              created_at: new Date()
            }
            await addRecruiterModel(setDataRecruiter)
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              port: 587,
              secure: false,
              auth: {
                user: process.env.email,
                pass: process.env.pass
              }
            })
            const mailOPtion = {
              from: `"Get Dream Job "${process.env.email}`,
              to: `${email_user}`,
              subject: `Hello ${email_user}, Recruiter`,
              html: `<a href="https://getdreamjob.netlify.app/confirm-email/${result.token_confirmEmail}">Click This Button</a>`
            }
            transporter.sendMail(mailOPtion, (err, result) => {
              if (err) {
                return helper.response(res, 400, 'Error Send Email', err)
              } else {
                return helper.response(res, 200, 'Success Send Email', result)
              }
            })
            return helper.response(
              res,
              200,
              `Registered Reqruiter email ${email_user} Successfully`,
              result
            )
          } else {
            const setData = {
              username,
              email_user,
              token_confirmEmail: require('crypto')
                .randomBytes(15)
                .toString('hex'),
              user_password: encryptPassword,
              roles: 0
            }
            const result = await seekerRegisModel(setData)
            const setDataPekerja = {
              id_pekerja: result.id_user,
              created_at: new Date()
            }
            await addPekerjaModel(setDataPekerja)
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              port: 587,
              secure: false,
              auth: {
                user: process.env.email,
                pass: process.env.pass
              }
            })
            const mailOPtion = {
              from: `"Get Dream Job "${process.env.email}`,
              to: `${email_user}`,
              subject: `Hello ${email_user}, Job Seaker`,
              html: `<a href="https://getdreamjob.netlify.app/confirm-email/${result.token_confirmEmail}">Click This Button</a></a>`
            }
            transporter.sendMail(mailOPtion, (err, result) => {
              if (err) {
                return helper.response(res, 400, 'Error Send Email', err)
              } else {
                return helper.response(res, 200, 'Success Send Email', result)
              }
            })
            return helper.response(
              res,
              200,
              `Registered Job Seeker email ${email_user} Successfully`,
              result
            )
          }
        } else {
          return helper.response(res, 400, 'All data must be filled in')
        }
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  confirmEmail: async (req, res) => {
    try {
      const { code_confirm } = req.params
      const checkDataLogin = await codeTokenCheckModel(code_confirm)
      if (checkDataLogin.length > 0) {
        if (checkDataLogin[0].status_user === 'OFF') {
          const sendActivation = {
            status_user: 'ON',
            update_at: new Date(),
            token_confirmEmail: require('crypto')
              .randomBytes(15)
              .toString('hex')
          }
          const result = await confirmEmail(code_confirm, sendActivation)
          return helper.response(
            res,
            200,
            `Activation your Email ${checkDataLogin[0].email_user} Succesfully`,
            result
          )
        } else {
          return helper.response(
            res,
            406,
            `Your Email ${checkDataLogin[0].email_user} Has been Active`
          )
        }
      } else {
        return helper.response(
          res,
          404,
          'You havent activated your account yet'
        )
      }
    } catch (err) {
      return helper.response(res, 400, 'Bad Request!', err)
    }
  },
  SendEmailForgotPassword: async (req, res) => {
    try {
      const { email } = req.body
      const checkEmail = await loginModel(email)
      if (checkEmail.length > 0) {
        const setToken = {
          token_forgotPassword: require('crypto')
            .randomBytes(15)
            .toString('hex'),
          update_at: new Date()
        }
        const result = await updateTokenForgetPass(email, setToken)
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          port: 587,
          secure: false,
          auth: {
            user: process.env.email,
            pass: process.env.pass
          }
        })
        const mailOPtion = {
          from: `"Get Dream Job "${process.env.email}`,
          to: `${email}`,
          subject: `Hello ${email}`,
          html: `<a href="https://getdreamjob.netlify.app/forgot/${result.token_forgotPassword}">Click This link to update your password</a>`
        }
        transporter.sendMail(mailOPtion, (err, result) => {
          if (err) {
            return helper.response(res, 400, 'Error Send Email', err)
          } else {
            return helper.response(
              res,
              200,
              'Check your email for the link to re-new your password'
            )
          }
        })
      } else {
        return helper.response(res, 400, 'This email is not registered')
      }
    } catch (err) {
      return helper.response(res, 400, 'Bad Request!', err)
    }
  },
  updatePasswordonForgetPass: async (req, res) => {
    try {
      const { token, password } = req.body
      const checkToken = await codeTokenForgotCheckModel(token)

      if (checkToken.length > 0) {
        const date = new Date()
        const timeStampDiff = await getTimeStampDiff(date, token)

        if (timeStampDiff <= 180) {
          // 3 mins
          const salt = bcrypt.genSaltSync(10)
          const encryptPassword = bcrypt.hashSync(password, salt)
          const setData = {
            user_password: encryptPassword,
            token_forgotPassword: '',
            update_at: new Date()
          }
          await updatePasswordForgot(token, setData)
          return helper.response(res, 200, 'Reset your Password Succesfully')
        } else {
          const setData = {
            token_forgotPassword: '',
            update_at: new Date()
          }
          await updatePasswordForgot(token, setData)
          return helper.response(res, 400, 'Your Token is Expired')
        }
      } else {
        return helper.response(res, 400, 'Your Token is Invalid')
      }
    } catch (err) {
      return helper.response(res, 400, 'Bad Request!', err)
    }
  },
  login: async (request, response) => {
    try {
      let { email_user, user_password, roles } = request.body
      roles = parseInt(roles)
      const checkDataLogin = await loginModel(email_user)
      if (checkDataLogin.length > 0) {
        if (roles === checkDataLogin[0].roles) {
          const checkPasssword = bcrypt.compareSync(
            user_password,
            checkDataLogin[0].user_password
          )
          if (checkPasssword) {
            const {
              id_user,
              email_user,
              roles,
              status_user
            } = checkDataLogin[0]
            if (status_user === 'ON') {
              const payload = {
                id_user,
                email_user,
                roles,
                status_user
              }
              const token = jwt.sign(payload, process.env.ACCESS, {
                expiresIn: '6hr'
              })
              const result = {
                ...payload,
                token
              }
              return helper.response(response, 200, 'Successs Login!', result)
            } else {
              return helper.response(
                response,
                400,
                "You haven't activated your account yet"
              )
            }
          } else {
            return helper.response(response, 400, 'Wrong Password!')
          }
        } else {
          let infoError
          if (checkDataLogin[0].roles === 0) {
            infoError = 'Your Email Not Register as Recruiter'
          } else {
            infoError = 'Your Email Not Register as Job Seaker'
          }
          return helper.response(response, 400, `${infoError}`)
        }
      } else {
        return helper.response(response, 400, "You haven't registered yet!")
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request!', error)
    }
  },
  editProfilePekerja: async (request, response) => {
    try {
      const { id } = request.params
      const {
        fullname_pekerja,
        job_desk,
        job_require,
        city_pekerja,
        status_jobs,
        work_place,
        desc_pekerja,
        instagram,
        linked,
        github
      } = request.body
      const checkProfilePekerja = await getProfilePekerjaModel(id)
      if (checkProfilePekerja.length > 0) {
        let imageUser
        if (request.file === undefined) {
          imageUser = {
            image_pekerja: checkProfilePekerja[0].image_pekerja
          }
        } else if (checkProfilePekerja[0].image_pekerja === null) {
          imageUser = {
            image_pekerja:
              request.file === undefined ? '' : request.file.filename
          }
        } else if (
          request.file.filename !== checkProfilePekerja[0].image_pekerja
        ) {
          fs.unlink(
            `./upload/fileUserProfile/${checkProfilePekerja[0].image_pekerja}`,
            (err) => {
              if (err) throw err
            }
          )
          imageUser = {
            image_pekerja:
              request.file === undefined ? '' : request.file.filename
          }
        }

        const setData = {
          id_pekerja: id,
          fullname_pekerja,
          job_desk,
          city_pekerja,
          status_jobs,
          work_place,
          job_require,
          instagram,
          linked,
          github,
          desc_pekerja,
          update_at: new Date()
        }
        const setProfileImage = { ...setData, ...imageUser }
        const result = await editProfilePekerjaModel(setProfileImage, id)
        return helper.response(
          response,
          200,
          `Success update profile user by id ${id}`,
          result
        )
      } else {
        fs.unlink(
          `./upload/fileUserProfile/${request.file.filename}`,
          (err) => {
            if (err) throw err
          }
        )
        return helper.response(response, 404, 'ID Not Found!')
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  getProfilePekerja: async (req, res) => {
    try {
      const { id } = req.params
      const result = await getProfilePekerjaModel(id)
      if (result.length > 0) {
        client.setex(
          `GDJprofilepekerjabyid:${id}`,
          1800,
          JSON.stringify(result)
        )
        return helper.response(
          res,
          200,
          `Success get data profil job seeker by id ${id}`,
          result
        )
      } else {
        return helper.response(res, 404, 'ID Not Found')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  changePassword: async (req, res) => {
    try {
      const { id } = req.params
      const { newPass } = req.body
      const salt = bcrypt.genSaltSync(10)
      const encrypt = bcrypt.hashSync(newPass, salt)
      const setPass = {
        user_password: encrypt
      }
      await changePasswordModel(setPass, id)
      return helper.response(res, 200, 'Success change your password')
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
