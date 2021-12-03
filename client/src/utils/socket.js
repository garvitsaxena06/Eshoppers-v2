import { useRef, useEffect, useContext } from 'react'
import { io } from 'socket.io-client'
import { AuthContext } from '../context/Auth'
import { SocketContext } from '../context/Socket'
import {
  setArrivalMessage,
  setNewConversation,
} from '../context/Socket/SocketActions'

const useSocket = () => {
  const { user } = useContext(AuthContext)
  const { dispatch } = useContext(SocketContext)
  const socket = useRef()

  useEffect(() => {
    if (user) {
      socket.current = io('https://viachat.docplus.online/chat')
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
      socket.current.on('getConversation', ({ senderId, conversation }) => {
        dispatch(setNewConversation({ senderId, conversation }))
      })
    }
  }, [user, dispatch])

  return { socket }
}

export default useSocket
