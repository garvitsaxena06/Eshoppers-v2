import React from 'react'
import { format } from 'timeago.js'
import './message.css'

const Message = ({ message, own, Decrypt, derivedKeys }) => {
  const [state, setState] = React.useState('')
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
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://www.stepstherapy.com.au/wp-content/uploads/2018/10/Yazmin-profile-picture-square.jpg"
          alt="profileImage"
        />
        <p className="messageText">{state}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  )
}

export default Message
