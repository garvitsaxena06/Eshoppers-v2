const SocketReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ONLINE_USERS':
      return {
        ...state,
        onlineUsers: action.payload,
      }
    case 'SET_ARRIVAL_MESSAGE':
      return {
        ...state,
        arrivalMessage: action.payload,
      }
    default:
      return state
  }
}

export default SocketReducer
