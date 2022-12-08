const { ChatController } = require('./chat.controller')
const io = require('socket.io')(8900, {
  cors: {
    origin: [
      'http://localhost:5000',
      'http://localhost:3000',
      'http://13.232.184.56',
      'https://13.232.184.56',
    ],
  },
})

const ChatIO = io.of('/chat')

ChatIO.on('connection', (socket) => {
  ChatController(socket, ChatIO)
})

// io.on('connection', (socket) => {

// })
