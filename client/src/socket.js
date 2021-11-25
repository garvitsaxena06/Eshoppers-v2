import { useRef, useEffect, useContext } from 'react'
import { io } from 'socket.io-client'
import { AuthContext } from './context/Auth'
import { SocketContext } from './context/Socket'
import { setArrivalMessage } from './context/Socket/SocketActions'

const useSocket = () => {
  const { user } = useContext(AuthContext)
  const { dispatch, arrivalMessage } = useContext(SocketContext)
  const socket = useRef()

  useEffect(() => {
    if (user) {
      socket.current = io('ws://localhost:8900')
      socket.current.emit('addUser', user?._id)
      socket.current.on('getMessage', ({ senderId, text }) => {
        dispatch(
          setArrivalMessage({
            sender: senderId,
            text,
            createdAt: Date.now(),
          })
        )
      })
    }
  }, [user, dispatch])

  return { socket }
}

export default useSocket
