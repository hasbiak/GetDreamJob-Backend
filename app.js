const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const routeNav = require('./src/routeNavigation.js')
const cors = require('cors')
require('dotenv').config()
const socket = require('socket.io')

const app = express()
app.use(morgan('dev'))
app.use('/gdj/fileuploadgdj', express.static('upload'))
app.use(express.static('upload'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  response.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})
app.use('/gdj', routeNav)

app.get('*', (request, response) => {
  response.status(404).send('Path not found')
})

const http = require('http')
const server = http.createServer(app)
const io = socket(server, {
  cors: {
    origin: '*'
  },
  path: '/gdj/socket.io'
})
io.on('connection', (socket) => {
  console.log('Socket.io Connect !')
  socket.on('globalMessage', (data) => {
    io.emit('chatMessage', data)
  })
  socket.on('privateMessage', (data) => {
    socket.emit('chatMessage', data)
  })
  socket.on('broadcastMessage', (data) => {
    socket.broadcast.emit('chatMessage', data)
  })
  socket.on('joinRoom', (data) => {
    socket.join(data.room)
  })
  socket.on('changeRoom', (data) => {
    socket.leave(data.oldRoom)
    socket.join(data.room)
  })
  socket.on('roomMessage', (data) => {
    io.to(data.room).emit('chatMessage', data)
  })
  socket.on('typing', (data) => {
    socket.broadcast.to(data.room).emit('typingMessage', data)
  })
})

server.listen(process.env.PORT, () => {
  console.log(`Express app is listening on port ${process.env.PORT}`)
})
