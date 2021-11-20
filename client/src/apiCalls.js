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
