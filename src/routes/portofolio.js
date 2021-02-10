const router = require('express').Router()
const { authorization, isSeeker } = require('../middleware/auth')
const {
  addPortofolio,
  editPortofolio,
  getPortofolio,
  deletePortofolio
} = require('../controller/portofolio')
const { uploadFilter, updateFilter } = require('../middleware/multerPortofolio')
const { getPortofolioByIdRedis, clearRedis } = require('../middleware/redis')

router.get('/:id', authorization, getPortofolioByIdRedis, getPortofolio)
router.post(
  '/',
  authorization,
  isSeeker,
  uploadFilter,
  clearRedis,
  addPortofolio
)
router.patch(
  '/:id',
  authorization,
  isSeeker,
  updateFilter,
  clearRedis,
  editPortofolio
)
router.delete('/delete/', authorization, isSeeker, clearRedis, deletePortofolio)

module.exports = router
