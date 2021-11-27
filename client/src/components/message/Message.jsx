import React, { useContext } from 'react'
import { format } from 'timeago.js'
import { AuthContext } from '../../context/Auth'
import './message.css'

const Message = ({ message, own, friend }) => {
  const { user } = useContext(AuthContext)

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
        <p className='messageText'>{message.text}</p>
      </div>
      <div className='messageBottom'>{format(message.createdAt)}</div>
    </div>
  )
}

export default Message
