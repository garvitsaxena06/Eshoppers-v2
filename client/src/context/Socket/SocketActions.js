export const setOnlineUsers = (users) => ({
  type: 'SET_ONLINE_USERS',
  payload: users,
})

export const setArrivalMessage = (message) => ({
  type: 'SET_ARRIVAL_MESSAGE',
  payload: message,
})

export const setNewConversation = (conversation) => ({
  type: 'SET_NEW_CONVERSATION',
  payload: conversation,
})
