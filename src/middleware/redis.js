const helper = require('../helper/helper')
const redis = require('redis')
const client = redis.createClient()

module.exports = {
  notifRedis: (request, response, next) => {
    const { id } = request.params
    client.get(`GDJnotifById:${id}`, (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          'You have an offering letter',
          JSON.parse(result)
        )
      } else {
        next()
      }
    })
  },
  getProfilePekerjaByIdRedis: (request, response, next) => {
    const { id } = request.params
    client.get(`GDJprofilepekerjabyid:${id}`, (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          `Success Get Data Profil Job Seeker By Id ${id}`,
          JSON.parse(result)
        )
      } else {
        next()
      }
    })
  },
  getPortofolioByIdRedis: (request, response, next) => {
    const { id } = request.params
    client.get(`GDJportofoliobyid:${id}`, (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          `Success Get Data Portofolio Job Seeker By Id ${id}`,
          JSON.parse(result)
        )
      } else {
        next()
      }
    })
  },
  getExperienceByIdRedis: (request, response, next) => {
    const { id } = request.params
    client.get(`GDJexperiencebyid:${id}`, (error, result) => {
      if (!error && result != null) {
        return helper.response(
          response,
          200,
          `Success Get Data Experience Job Seeker By Id ${id}`,
          JSON.parse(result)
        )
      } else {
        next()
      }
    })
  },
  searchSortRedis: (request, response, next) => {
    client.get(
      `GDJsearchsort:${JSON.stringify(request.query)}`,
      (error, result) => {
        if (!error && result != null) {
          const newResult = JSON.parse(result)
          return helper.response(
            response,
            200,
            'Success Get data pekerja',
            newResult.result,
            newResult.newPage
          )
        } else {
          next()
        }
      }
    )
  },
  getDataBySkillSortingRedis: (request, response, next) => {
    client.get(
      `GDJdatabyskillsorting:${JSON.stringify(request.query)}`,
      (error, result) => {
        if (!error && result != null) {
          const newResult = JSON.parse(result)
          return helper.response(
            response,
            200,
            'Success get data pekerja by sorting skill',
            newResult.result,
            newResult.pageInfo
          )
        } else {
          next()
        }
      }
    )
  },
  getDatabyLimitRedis: (request, response, next) => {
    client.get(
      `GDJgetdatabylimit:${JSON.stringify(request.query)}`,
      (error, result) => {
        if (!error && result != null) {
          const newResult = JSON.parse(result)
          return helper.response(
            response,
            200,
            'Succes get data pekerja',
            newResult.result,
            newResult.newPage
          )
        } else {
          next()
        }
      }
    )
  },
  getCompanyProfileByIdRedis: (request, response, next) => {
    const { id } = request.params
    client.get(`GDJcompanyprofilebyid:${id}`, (error, result) => {
      if (!error && result !== null) {
        return helper.response(
          response,
          200,
          `Success get company profile id ${id}`,
          JSON.parse(result)
        )
      } else {
        next()
      }
    })
  },
  getSkillByIdRedis: (request, response, next) => {
    const { id } = request.params
    client.get(`GDJskill:${id}`, (error, result) => {
      if (!error && result !== null) {
        return helper.response(
          response,
          200,
          `Success get skill by id ${id}`,
          JSON.parse(result)
        )
      } else {
        next()
      }
    })
  },
  clearRedis: (request, response, next) => {
    client.keys('GDJ*', (_error, result) => {
      if (result.length > 0) {
        result.forEach((value) => {
          client.del(value)
        })
      }
      next()
    })
  }
}
