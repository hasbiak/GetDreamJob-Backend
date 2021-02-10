const router = require('express').Router()

const {
  createRoom,
  getRoom,
  getRoom2User,
  sendMessage,
  getMessage
} = require('../controller/chat')
// const { authorization } = require('../middleware/auth')

router.get('/room/:id', getRoom)
router.get('/rooms', getRoom2User)
router.post('/room', createRoom)
router.post('/message', sendMessage)
router.get('/message/:id', getMessage)

module.exports = router
