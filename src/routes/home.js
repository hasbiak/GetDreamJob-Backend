const router = require('express').Router()
const { authorization, isRecruiter } = require('../middleware/auth')
const {
  searchSortRedis,
  getDataBySkillSortingRedis,
  getDatabyLimitRedis,
  clearRedis
} = require('../middleware/redis')
const {
  searchSort,
  getDataBySkillSorting,
  getDatabyLimit
} = require('../controller/home')

router.get(
  '/',
  authorization,
  isRecruiter,
  searchSortRedis,
  clearRedis,
  searchSort
)
router.get(
  '/getsortingskill',
  authorization,
  isRecruiter,
  getDataBySkillSortingRedis,
  clearRedis,
  getDataBySkillSorting
)
router.get(
  '/limit',
  authorization,
  isRecruiter,
  getDatabyLimitRedis,
  clearRedis,
  getDatabyLimit
)

module.exports = router
