const router = require('express').Router()
const { authorization, isSeeker } = require('../middleware/auth')
const uploadFilesUser = require('../middleware/multerUserProfile')
const {
  getProfilePekerjaByIdRedis,
  clearRedis
} = require('../middleware/redis.js')

const {
  register,
  confirmEmail,
  SendEmailForgotPassword,
  updatePasswordonForgetPass,
  login,
  editProfilePekerja,
  getProfilePekerja,
  changePassword
} = require('../controller/user')

router.post('/register', register)
router.post('/forgot', SendEmailForgotPassword)
router.patch('/resetPassword', updatePasswordonForgetPass)
router.patch('/activation/:code_confirm', confirmEmail)
router.post('/login', login)
router.get(
  '/profile/:id',
  authorization,
  getProfilePekerjaByIdRedis,
  getProfilePekerja
)
router.patch(
  '/editprofile/:id',
  authorization,
  isSeeker,
  uploadFilesUser,
  clearRedis,
  editProfilePekerja
)
router.patch('/changepass/:id', changePassword)

module.exports = router
