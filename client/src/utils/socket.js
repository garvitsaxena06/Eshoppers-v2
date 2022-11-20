import { useRef, useEffect, useContext } from 'react'
import { io } from 'socket.io-client'
import { AuthContext } from '../context/Auth'
import { SocketContext } from '../context/Socket'
import {
  setArrivalMessage,
  setNewConversation,
} from '../context/Socket/SocketActions'
import PushNotification from './pushNotification'

const useSocket = () => {
  const { user } = useContext(AuthContext)
  const { dispatch } = useContext(SocketContext)
  const socket = useRef()
  const { pushNotification } = PushNotification()

  useEffect(() => {
    if (user) {
      socket.current = io('ws://localhost:8900/chat')
      socket.current.emit('addUser', user?._id)
      socket.current.on('getMessage', ({ senderId, text }) => {
        dispatch(
          setArrivalMessage({
            sender: senderId,
            text,
            createdAt: Date.now(),
          })
        )
        pushNotification({ senderId, text })
      })
      socket.current.on('getConversation', ({ senderId, conversation }) => {
        dispatch(setNewConversation({ senderId, conversation }))
      })
    }
    // eslint-disable-next-line
  }, [user, dispatch])

  return { socket }
}

export default useSocket
