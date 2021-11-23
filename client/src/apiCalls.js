import axios from 'axios'

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: 'LOGIN_START' })
  try {
    const res = await axios.post('/auth/login', userCredential)
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.data })
  } catch (err) {
    dispatch({ type: 'LOGIN_FAILURE', payload: err })
  }
}

export const getUserById = async (id) => {
  return await axios.get('/users?userId=' + id)
}

export const getConversations = async (id) => {
  return await axios.get('/conversations/' + id)
}

export const getMessages = async (id) => {
  return await axios.get('/messages/' + id)
}

export const sendNewMessage = async (payload) => {
  return await axios.post('/messages', payload)
}

export const getFriends = async (id) => {
  return await axios.get('/users/friends/' + id)
}

export const getFriendsByUserName = async (id) => {
  return await axios.get('/users/friendsByUserName/:userName' + id)
}

export const getConversationByOfTwoUsers = async (us1, us2) => {
  return await axios.get(`/conversations/find/${us1}/${us2}`)
}

export const searchUserByUsername = async (q) => {
  return await axios.get(`/users/search?q=${q}`)
}
