const {
  addExperienceModel,
  editExperienceModel,
  getExperienceModel,
  getExperienceByIdModel,
  deleteExperienceModel,
  deleteAllModel
} = require('../model/experience')
const helper = require('../helper/helper')
const redis = require('redis')
const client = redis.createClient()

module.exports = {
  getExperience: async (req, res) => {
    try {
      const { id } = req.params
      const result = await getExperienceModel(id)
      if (result.length > 0) {
        client.setex(`GDJexperiencebyid:${id}`, 1800, JSON.stringify(result))
        return helper.response(
          res,
          200,
          `Success get experiences user by id ${id}`,
          result
        )
      } else {
        return helper.response(res, 404, 'ID Not Found')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  addExperience: async (req, res) => {
    try {
      const experience = req.body
      const id = experience[0].id_pekerja
      const cek = await getExperienceModel(id)
      if (cek.length > 0) {
        const result = await deleteAllModel(id)
      }
      let resultExperience
      for (let i = 0; i < experience.length; i++) {
        const {
          id_pekerja,
          posisi,
          at_company,
          date,
          description
        } = experience[i]
        const setExperience = {
          id_pekerja,
          posisi,
          at_company,
          date,
          description,
          created_at: new Date()
        }
        resultExperience = await addExperienceModel(setExperience)
      }
      return helper.response(
        res,
        200,
        'Success Add Experiences',
        resultExperience
      )
    } catch (err) {
      return helper.response(res, 400, 'Bad Request', err)
    }
  },
  editExperience: async (req, res) => {
    try {
      const { id_pekerja, id, posisi, at_company, date, description } = req.body
      const checkId = await getExperienceByIdModel(id)
      if (checkId.length > 0) {
        const setData = {
          id_pekerja,
          id,
          posisi,
          at_company,
          date,
          description,
          updated_at: new Date()
        }
        const edit = await editExperienceModel(setData, id)
        return helper.response(
          res,
          200,
          `Success update experiences user by id ${id_pekerja}`,
          edit
        )
      } else {
        return helper.response(res, 404, 'ID Not Found')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  deleteExperience: async (req, res) => {
    try {
      let { id, idPekerja } = req.query
      id = parseInt(id)
      idPekerja = parseInt(idPekerja)
      const checkId = await getExperienceByIdModel(id)
      if (checkId.length > 0) {
        await deleteExperienceModel(id, idPekerja)
        return helper.response(
          res,
          200,
          `Success delete experience user by id ${idPekerja}`
        )
      } else {
        return helper.response(res, 404, 'ID Not Found')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  },
  deleteAllExperience: async (req, res) => {
    try {
      const { id } = req.query
      const result = await deleteAllModel(id)
      if (result.length == null) {
        return helper.response(res, 200, 'Success delete all experience by id')
      } else {
        return helper.response(res, 404, `Experience Id : ${id} Not Found`)
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
