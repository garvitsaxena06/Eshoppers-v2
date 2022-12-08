import { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import {
  setArrivalMessage,
  setNewConversation,
} from '../store/actions/socketActions'
import PushNotification from './pushNotification'

const useSocket = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
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
