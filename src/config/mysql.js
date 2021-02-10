const mysql = require('mysql')
require('dotenv').config()

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

connection.connect((error) => {
  if (error) {
    console.log(`Turn on the database! ${error}`)
  } else {
    console.log('You are now connected to database ...')
  }
})

module.exports = connection
