const {
  addPortofolioModel,
  editPortofolioModel,
  deletePortofolioModel,
  getPhotoPortofolioModel,
  getPortofolioByIdModel,
  getPortofolioModel
} = require('../model/portoflio')
const helper = require('../helper/helper')
const fs = require('fs')
const redis = require('redis')
const client = redis.createClient()

module.exports = {
  addPortofolio: async (request, response) => {
    try {
      const {
        id_pekerja,
        application_name,
        repo_link,
        type_portofolio
      } = request.body
      const setPorto = {
        id_pekerja,
        application_name,
        repo_link,
        type_portofolio,
        image_portofolio:
          request.file === undefined ? '' : request.file.filename,
        create_at: new Date()
      }
      const checking = await getPortofolioModel(id_pekerja)
      if (checking.length > 0) {
        const result = await addPortofolioModel(setPorto)
        return helper.response(response, 200, 'Success Add Portofolio', result)
      } else {
        fs.unlink(
          `./upload/imagePorto/${request.file.filename}`,
          function (err) {
            if (err) {
              return helper.response(response, 404, 'Invalid Upload Image')
            }
          }
        )
        return helper.response(
          response,
          404,
          `Pekerja with id ${id_pekerja} not found`
        )
      }
    } catch (error) {
      fs.unlink(`./upload/imagePorto/${request.file.filename}`, function (err) {
        if (err) {
          return helper.response(response, 404, 'Invalid Upload Image')
        }
      })
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  editPortofolio: async (req, res) => {
    try {
      const { id } = req.params
      const {
        id_pekerja,
        application_name,
        repo_link,
        type_portofolio
      } = req.body
      const photo = await getPhotoPortofolioModel(id)
      const checkPortofolioSeeker = await getPortofolioModel(id_pekerja)
      const checkPortofolio = await getPortofolioByIdModel(id)
      if (checkPortofolioSeeker.length > 0) {
        if (checkPortofolio.length > 0) {
          const setData = {
            id_pekerja,
            application_name,
            repo_link,
            type_portofolio,
            update_at: new Date(),
            image_portofolio: req.file === undefined ? photo : req.file.filename
          }
          if (setData.image_portofolio !== photo && photo !== '') {
            fs.unlink(`./upload/imagePorto/${photo}`, function (err) {
              if (err) {
                return helper.response(res, 404, 'Invalid Upload Image')
              }
            })
          }
          const edit = await editPortofolioModel(setData, id)
          return helper.response(
            res,
            200,
            `Success update portofolio user by id ${id_pekerja}`,
            edit
          )
        } else {
          return helper.response(res, 404, 'ID Not Found!')
        }
      } else {
        return helper.response(res, 404, 'ID Seeker is Not Found!')
      }
    } catch (error) {
      fs.unlink(`./upload/imagePorto/${req.file.filename}`, function (err) {
        if (err) {
          return helper.response(res, 404, 'Invalid Upload Image')
        }
      })
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  getPortofolio: async (req, res) => {
    try {
      const { id } = req.params
      const result = await getPortofolioModel(id)
      if (result.length > 0) {
        const resultPorto = await getPortofolioByIdModel(id)
        client.setex(
          `GDJportofoliobyid:${id}`,
          1800,
          JSON.stringify(resultPorto)
        )
        return helper.response(
          res,
          200,
          `Success get portofolio user by id ${id}`,
          resultPorto
        )
      } else {
        return helper.response(res, 404, 'ID Not Found')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  deletePortofolio: async (req, res) => {
    try {
      let { id, idPekerja } = req.query
      id = parseInt(id)
      idPekerja = parseInt(idPekerja)
      const checkIdSeeker = await getPortofolioModel(idPekerja)
      const checkId = await getPortofolioByIdModel(idPekerja)

      if (checkIdSeeker.length > 0) {
        if (checkId.length > 0) {
          const photo = await getPhotoPortofolioModel(id)
          fs.unlink(`./upload/imagePorto/${photo}`, function (err) {
            if (err) {
              return helper.response(res, 404, 'Invalid Upload Image')
            }
          })
          await deletePortofolioModel(id, idPekerja)
          return helper.response(
            res,
            200,
            `Success delete portofolio user by id ${idPekerja}`
          )
        } else {
          return helper.response(res, 404, 'ID Not Found')
        }
      } else {
        return helper.response(res, 404, 'ID Seeker is Not Found')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
