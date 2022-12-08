import React from 'react'
import { useSelector } from 'react-redux'
import { format } from 'timeago.js'
import './message.css'

const Message = ({
  message,
  own,
  Decrypt,
  derivedKeys,
  friend,
  encryptMessages,
  setSendFile = () => {},
  setIsVisible = () => {},
}) => {
  const [state, setState] = React.useState('')
  const { user } = useSelector((state) => state.user)
  React.useEffect(() => {
    const getMessages = async () => {
      const decryptedMessage = await Decrypt(message.text, derivedKeys)
      setState(decryptedMessage)
    }
    getMessages()
    // eslint-disable-next-line
  }, [message, derivedKeys])

  return (
    <div className={`message${own ? ' own' : ''}`}>
      <div className='messageTop'>
        <img
          className='messageImg'
          src={
            own
              ? user?.profilePicture
                ? user?.profilePicture
                : 'https://d225jocw4xhwve.cloudfront.net/person/noAvatar.png'
              : friend?.profilePicture
              ? friend?.profilePicture
              : 'https://d225jocw4xhwve.cloudfront.net/person/noAvatar.png'
          }
          alt='profileImage'
        />
        {state.startsWith('http') &&
        (state.includes('.png') ||
          state.includes('.jpeg') ||
          state.includes('.jpg')) &&
        !encryptMessages ? (
          <img
            className='imgInChat'
            src={state}
            alt=''
            onClick={() => {
              setSendFile(state)
              setIsVisible(true)
            }}
          />
        ) : (
          <p className='messageText'>
            {encryptMessages ? message.text : state}
          </p>
        )}
      </div>
      <div className='messageBottom'>{format(message.createdAt)}</div>
    </div>
  )
}

export default Message
