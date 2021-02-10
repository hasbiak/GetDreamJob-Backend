const {
  getCompanyProfileById,
  patchCompanyProfile,
  patchUserModel,
  getIdRecruiterModel
} = require('../model/companyProfile')
const helper = require('../helper/helper')
const fs = require('fs')
const redis = require('redis')
const client = redis.createClient()

module.exports = {
  getCompanyProfileById: async (request, response) => {
    try {
      const { id } = request.params
      const result = await getCompanyProfileById(id)
      if (result.length > 0) {
        client.setex(
          `GDJcompanyprofilebyid:${id}`,
          1800,
          JSON.stringify(result)
        )
        return helper.response(
          response,
          200,
          'Succes get Company Profile By Id',
          result
        )
      } else {
        return helper.response(
          response,
          404,
          `Company Profile By Id : ${id} Not Found`
        )
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },

  patchCompanyProfile: async (request, response) => {
    try {
      const { id } = request.params
      const {
        company_name,
        jabatan,
        city_recruiter,
        desc_recruiter,
        social_media,
        email_user,
        phone_number,
        linked_in
      } = request.body
      const checkId = await getIdRecruiterModel(id)
      if (checkId.length > 0) {
        const getRec = await getCompanyProfileById(checkId[0].id_user)
        let imageUser
        if (request.file === undefined) {
          imageUser = {
            image_recruiter: getRec[0].image_recruiter
          }
        } else if (getRec[0].image_recruiter === null) {
          imageUser = {
            image_recruiter:
              request.file === undefined ? '' : request.file.filename
          }
        } else if (request.file.filename !== getRec[0].image_recruiter) {
          fs.unlink(
            `./upload/userRecruiter/${getRec[0].image_recruiter}`,
            (err) => {
              if (err) throw err
            }
          )
          imageUser = {
            image_recruiter:
              request.file === undefined ? '' : request.file.filename
          }
        }

        const setUser = {
          company_name,
          jabatan,
          phone_number,
          email_user,
          update_at: new Date()
        }
        const resultUser = await patchUserModel(setUser, id)
        const setProfile = {
          city_recruiter,
          desc_recruiter,
          social_media,
          linked_in,
          update_at: new Date()
        }
        const setProfileImage = { ...setProfile, ...imageUser }
        const result = await patchCompanyProfile(setProfileImage, id)
        const lastResult = {
          resultUser,
          result
        }
        return helper.response(
          response,
          200,
          `Profile By Id: ${id} Success`,
          lastResult
        )
      } else {
        fs.unlink(
          `./upload/userRecruiter/${request.file.filename}`,
          function (err) {
            if (err) {
              return helper.response(response, 404, 'Invalid Upload Image')
            }
          }
        )
        return helper.response(response, 404, `Profile By Id: ${id} Not Found`)
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  }
}
