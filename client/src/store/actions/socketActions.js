import {
  SET_ARRIVAL_MESSAGE,
  SET_NEW_CONVERSATION,
  SET_ONLINE_USERS,
} from '../constants/socketConstants'

export const setOnlineUsers = (users) => (dispatch) => {
  dispatch({
    type: SET_ONLINE_USERS,
    payload: users,
  })
}

export const setArrivalMessage = (message) => (dispatch) => {
  dispatch({
    type: SET_ARRIVAL_MESSAGE,
    payload: message,
  })
}

export const setNewConversation = (conversation) => (dispatch) => {
  dispatch({
    type: SET_NEW_CONVERSATION,
    payload: conversation,
  })
}
