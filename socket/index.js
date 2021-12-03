const { ChatController } = require('./chat.controller')
const io = require('socket.io')(8900, {
  cors: {
    origin: [
      'http://localhost:5000',
      'http://localhost:3000',
      'http://13.232.184.56',
      'https://13.232.184.56',
      'https://viachat.docplus.online',
      'http://viachat.docplus.online',
    ],
  },
})

const ChatIO = io.of('/chat')

ChatIO.on('connection', ChatController)

// io.on('connection', (socket) => {

// })
