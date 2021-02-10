const helper = require('../helper/helper')
const qs = require('querystring')
require('dotenv').config()
const {
  searchSorthModel,
  getSearchCountModel,
  getSkill,
  getDataBySkillSortingModel,
  getDataCountModel,
  getCountSkillModel,
  getDataLimit
} = require('../model/home')
const redis = require('redis')
const client = redis.createClient()

module.exports = {
  searchSort: async (request, response) => {
    try {
      let { page, limit, search, sort, status } = request.query
      page = parseInt(page)
      limit = parseInt(limit)
      let searching
      if (search) {
        searching = search
      } else {
        searching = ''
      }
      let sorting
      if (sort) {
        sorting = sort
      } else {
        sorting = ''
      }
      let StatusNeedit
      if (status) {
        StatusNeedit = status
      } else {
        StatusNeedit = ''
      }
      const totalData1 = await getSearchCountModel(searching, StatusNeedit)
      const totalData = totalData1.length
      const totalPage = Math.ceil(totalData / limit)
      const offset = page * limit - limit
      const prevLink =
        page > 1
          ? qs.stringify({ ...request.query, ...{ page: page - 1 } })
          : null
      const nextLink =
        page < totalPage
          ? qs.stringify({ ...request.query, ...{ page: page + 1 } })
          : null
      const newPage = {
        page,
        limit,
        totalPage,
        totalData,
        nextLink: nextLink && `http://localhost:3000/home/?${nextLink}`,
        prevLink: prevLink && `http://localhost:3000/home/?${prevLink}`
      }
      const result = await searchSorthModel(
        limit,
        offset,
        searching,
        StatusNeedit,
        sorting
      )
      for (let i = 0; i < result.length; i++) {
        result[i].skills = await getSkill(result[i].id_pekerja)
      }
      const newData = {
        result,
        newPage
      }
      client.setex(
        `GDJsearchsort:${JSON.stringify(request.query)}`,
        1800,
        JSON.stringify(newData)
      )
      return helper.response(
        response,
        200,
        'Succes get data pekerja',
        result,
        newPage
      )
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  getDataBySkillSorting: async (request, response) => {
    try {
      let { page, limit } = request.query
      page = parseInt(page)
      limit = parseInt(limit)

      const Data = await getCountSkillModel()
      const totalData = Data.length

      const totalPage = Math.ceil(totalData / limit)
      const offset = page * limit - limit
      const prevLink =
        page > 1
          ? qs.stringify({ ...request.query, ...{ page: page - 1 } })
          : null
      const nextLink =
        page < totalPage
          ? qs.stringify({ ...request.query, ...{ page: page + 1 } })
          : null
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
        nextLink:
          nextLink &&
          `http://localhost:${process.env.PORT}/home/getsortingskill/?${nextLink}`,
        prevLink:
          prevLink &&
          `http://localhost:${process.env.PORT}/home/getsortingskill/?${prevLink}`
      }
      const result = await getDataBySkillSortingModel(limit, offset)
      for (let i = 0; i < result.length; i++) {
        result[i].skills = await getSkill(result[i].id_pekerja)
      }
      const newData = {
        result,
        pageInfo
      }
      client.setex(
        `GDJdatabyskillsorting:${JSON.stringify(request.query)}`,
        1800,
        JSON.stringify(newData)
      )
      return helper.response(
        response,
        200,
        'Success get data pekerja by sorting skill',
        result,
        pageInfo
      )
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  getDatabyLimit: async (req, res) => {
    try {
      let { page, limit, sort, status } = req.query
      page = parseInt(page)
      limit = parseInt(limit)
      let sorting
      if (sort) {
        sorting = sort
      } else {
        sorting = ''
      }
      let statusPekerja
      if (status) {
        statusPekerja = status
      } else {
        statusPekerja = ''
      }
      const totalData = await getDataCountModel(statusPekerja)
      const totalPage = Math.ceil(totalData / limit)
      const offset = page * limit - limit
      const prevLink =
        page > 1 ? qs.stringify({ ...req.query, ...{ page: page - 1 } }) : null
      const nextLink =
        page < totalPage
          ? qs.stringify({ ...req.query, ...{ page: page + 1 } })
          : null
      const newPage = {
        page,
        limit,
        totalPage,
        totalData,
        nextLink: nextLink && `http://localhost:3000/home/limit/?${nextLink}`,
        prevLink: prevLink && `http://localhost:3000/home/limit/?${prevLink}`
      }
      const result = await getDataLimit(limit, offset, statusPekerja, sorting)
      for (let i = 0; i < result.length; i++) {
        result[i].skills = await getSkill(result[i].id_pekerja)
      }
      const newData = {
        result,
        newPage
      }
      client.setex(
        `GDJdatabylimit:${JSON.stringify(req.query)}`,
        1800,
        JSON.stringify(newData)
      )
      return helper.response(
        res,
        200,
        'Succes get data pekerja',
        result,
        newPage
      )
    } catch (err) {
      return helper.response(res, 400, 'Bad Request', err)
    }
  }
}
