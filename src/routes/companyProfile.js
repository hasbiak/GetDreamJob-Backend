const router = require('express').Router()
const { authorization, isRecruiter } = require('../middleware/auth')
const {
  getCompanyProfileById,
  patchCompanyProfile
} = require('../controller/companyProfile')
const {
  getCompanyProfileByIdRedis,
  clearRedis
} = require('../middleware/redis')
const uploadImage = require('../middleware/multer')

router.get(
  '/:id',
  authorization,
  getCompanyProfileByIdRedis,
  getCompanyProfileById
)

router.patch(
  '/:id',
  authorization,
  isRecruiter,
  uploadImage,
  clearRedis,
  patchCompanyProfile
)

module.exports = router
