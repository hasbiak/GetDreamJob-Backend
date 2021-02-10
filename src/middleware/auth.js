const jwt = require('jsonwebtoken')
const helper = require('../helper/helper.js')
module.exports = {
  authorization: (request, response, next) => {
    let token = request.headers.authorization
    if (token) {
      token = token.split(' ')[1]
      jwt.verify(token, process.env.ACCESS, (error, result) => {
        if (
          (error && error.name === 'JsonWebTokenError') ||
          (error && error.name === 'TokenExpiredError')
        ) {
          return helper.response(response, 403, error.message)
        } else {
          request.token = result
          next()
        }
      })
    } else {
      return helper.response(response, 403, 'Please Login First!')
    }
  },
  isRecruiter: (request, response, next) => {
    if (request.token.roles === 1 && request.token.status_user === 'ON') {
      next()
    } else {
      return helper.response(response, 403, "You aren't authorized!")
    }
  },
  isSeeker: (request, response, next) => {
    if (request.token.roles === 0 && request.token.status_user === 'ON') {
      next()
    } else {
      return helper.response(response, 403, "You aren't authorized!")
    }
  }
}
