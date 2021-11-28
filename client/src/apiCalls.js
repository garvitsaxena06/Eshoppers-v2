import axios from 'axios'
import { message } from 'antd'

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: 'LOGIN_START' })
  try {
    const res = await axios.post('/auth/login', userCredential)
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.data })
    message.success('Logged in successfully.')
  } catch (err) {
    dispatch({ type: 'LOGIN_FAILURE', payload: err })
    message.error(err?.response?.data?.message)
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

export const updateUser = async (data) => {
  return await axios.put(`/users/${data.userId}`, data)
}
