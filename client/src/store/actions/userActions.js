import {
  FOLLOW,
  LOGIN_FAILURE,
  LOGIN_START,
  LOGIN_SUCCESS,
  UNFOLLOW,
  LOGOUT,
} from '../constants/userConstants'

export const loginStart = () => (dispatch, getState) => {
  dispatch({ type: LOGIN_START })
  localStorage.setItem('user', JSON.stringify(getState().user))
}

export const loginSuccess = (user) => (dispatch, getState) => {
  dispatch({ type: LOGIN_SUCCESS, payload: user })
  localStorage.setItem('user', JSON.stringify(getState().user))
}

export const loginFailure = () => (dispatch, getState) => {
  dispatch({ type: LOGIN_FAILURE })
  localStorage.setItem('user', JSON.stringify(getState().user))
}

export const followAction = (userId) => (dispatch, getState) => {
  dispatch({ type: FOLLOW, payload: userId })
  localStorage.setItem('user', JSON.stringify(getState().user))
}

export const unfollowAction = (userId) => (dispatch, getState) => {
  dispatch({ type: UNFOLLOW, payload: userId })
  localStorage.setItem('user', JSON.stringify(getState().user))
}

export const logoutUser = () => (dispatch, getState) => {
  dispatch({ type: LOGOUT })
  localStorage.removeItem('user')
}
