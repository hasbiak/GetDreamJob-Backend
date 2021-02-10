const multer = require('multer')
const helper = require('../helper/helper')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/fileHire')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  }
})

const maxSize = 5 * 1024 * 1024
const upload = multer({
  storage,
  limits: { fileSize: maxSize }
}).single('files')

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

module.exports = uploadFilter
