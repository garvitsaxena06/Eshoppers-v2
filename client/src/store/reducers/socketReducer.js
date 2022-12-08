import {
  SET_ARRIVAL_MESSAGE,
  SET_NEW_CONVERSATION,
  SET_ONLINE_USERS,
} from '../constants/socketConstants'

export const socketReducer = (
  state = {
    onlineUsers: [],
    arrivalMessage: null,
    newConversation: null,
  },
  action
) => {
  switch (action.type) {
    case SET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: action.payload,
      }
    case SET_ARRIVAL_MESSAGE:
      return {
        ...state,
        arrivalMessage: action.payload,
      }
    case SET_NEW_CONVERSATION:
      return {
        ...state,
        newConversation: action.payload,
      }
    default:
      return state
  }
}
