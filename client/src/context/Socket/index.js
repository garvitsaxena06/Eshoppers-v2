import { createContext, useReducer } from 'react'
import SocketReducer from './SocketReducer'

const INITIAL_STATE = {
  onlineUsers: [],
  arrivalMessage: null,
}

export const SocketContext = createContext(INITIAL_STATE)

export const SocketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SocketReducer, INITIAL_STATE)

  return (
    <SocketContext.Provider
      value={{
        onlineUsers: state.onlineUsers,
        arrivalMessage: state.arrivalMessage,
        dispatch,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
