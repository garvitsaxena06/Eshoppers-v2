import axios from 'axios'
import { message } from 'antd'
import {
  POSTS_BASE_URL,
  USERS_BASE_URL,
  MESSAGES_BASE_URL,
  CONVERSATIONS_BASE_URL,
} from './utils/connections.js'

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: 'LOGIN_START' })
  try {
    const res = await axios.post(`${USERS_BASE_URL}/login`, userCredential)
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.data })
    message.success('Logged in successfully.')
  } catch (err) {
    dispatch({ type: 'LOGIN_FAILURE', payload: err })
    message.error(err?.response?.data?.message)
  }
}

export const RegisterCall = async (user, dispatch) =>
  await axios.post(`${USERS_BASE_URL}/register`, user)

export const getUserById = async (id) =>
  await axios.get(`${USERS_BASE_URL}?userId=` + id)

export const getUserByUsername = async (id) =>
  await axios.get(`${USERS_BASE_URL}?username=` + id)

export const getFriends = async (id) =>
  await axios.get(`${USERS_BASE_URL}/friends/` + id)

export const getFriendsByUserName = async (id) =>
  await axios.get(`${USERS_BASE_URL}/friendsByUserName/` + id)

export const unfollow = async (id, userId) =>
  await axios.put(`${USERS_BASE_URL}/${id}/unfollow`, {
    userId,
  })

export const follow = async (id, userId) =>
  await axios.put(`${USERS_BASE_URL}/${id}/follow`, {
    userId,
  })

export const updateUser = async (data) => {
  return await axios.put(`${USERS_BASE_URL}/${data.userId}`, data)
}

export const getConversations = async (id) => {
  return await axios.get(`${CONVERSATIONS_BASE_URL}/` + id)
}

export const getMessages = async (id) => {
  return await axios.get(`${MESSAGES_BASE_URL}/` + id)
}

export const sendNewMessage = async (payload) => {
  return await axios.post(`${MESSAGES_BASE_URL}`, payload)
}

export const getConversationByOfTwoUsers = async (us1, us2) => {
  return await axios.get(`${CONVERSATIONS_BASE_URL}/find/${us1}/${us2}`)
}

export const searchUserByUsername = async (q) => {
  return await axios.get(`${USERS_BASE_URL}/search?q=${q}`)
}

export const likePost = async ({ _id, payload }) =>
  await axios.put(`${POSTS_BASE_URL}/${_id}/like`, payload)

export const deletePost = async ({ _id, userId }) =>
  await axios.delete(`${POSTS_BASE_URL}/${_id}`)
