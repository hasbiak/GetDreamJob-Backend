const multer = require('multer')
const { getPortofolioByIdModel } = require('../model/portoflio')
const helper = require('../helper/helper')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/imagePorto')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  }
})

const fileFilter = (request, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/webp' ||
    file.mimetype === 'application/octet-stream'
  ) {
    cb(null, true)
  } else {
    cb(new Error('Extension file must be PNG , JPEG or webp'), false)
  }
}

const maxSize = 2 * 1024 * 1024
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSize }
}).single('image_portofolio')

const uploadFilter = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return helper.response(res, 400, err.message)
    } else if (err) {
      return helper.response(res, 400, err.message)
    }
    next()
  })
}
const updateFilter = async (req, res, next) => {
  const { id } = req.params
  const checkId = await getPortofolioByIdModel(id)
  if (checkId.length > 0) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return helper.response(res, 400, err.message)
      } else if (err) {
        return helper.response(res, 400, err.message)
      }
      next()
    })
  } else {
    return helper.response(res, 404, `Id ${id} is Not Found`)
  }
}

module.exports = { uploadFilter, updateFilter }
