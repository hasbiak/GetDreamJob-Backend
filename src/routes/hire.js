const router = require('express').Router()
const { authorization, isSeeker, isRecruiter } = require('../middleware/auth')
const uploadFiles = require('../middleware/multerFileHire')
const { hire, notif, deleteNotif, countNotif } = require('../controller/hire')
/* const { clearRedis } = require('../middleware/redis') */

router.post('/', authorization, isRecruiter, uploadFiles, hire)
router.get('/notif/:id', authorization, isSeeker, notif)
router.delete('/deletenotif/:id', authorization, isSeeker, deleteNotif)
router.get('/countnotif/:id', authorization, isSeeker, countNotif)

module.exports = router
