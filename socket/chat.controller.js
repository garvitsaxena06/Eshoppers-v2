let users = []

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId })
}

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId)
}

const removeUserByUserId = (userId) => {
  users = users.filter((user) => user.userId !== userId)
}

const getUser = (userId) => {
  return users.find((user) => user.userId === userId)
}

function ChatController(socket, ChatIO) {
  // when connect
  console.log('a user connected.')

  // take userId and socketId from user
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id)
    ChatIO.emit('getUsers', users)
  })

  // send and get message
  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId)
    ChatIO.to(user?.socketId).emit('getMessage', {
      senderId,
      text,
    })
  })

  // add conversation
  socket.on('addConversation', ({ senderId, receiverId, conversation }) => {
    const user = getUser(receiverId)
    ChatIO.to(user?.socketId).emit('getConversation', {
      senderId,
      conversation,
    })
  })

  // logout user
  socket.on('logoutUser', (id) => {
    console.log('a user disconnected.')
    removeUserByUserId(id)
    ChatIO.emit('getUsers', users)
  })

  // disconnect a user
  socket.on('disconnect', () => {
    console.log('a user disconnected.')
    removeUser(socket.id)
    ChatIO.emit('getUsers', users)
  })
}

module.exports = { ChatController }
