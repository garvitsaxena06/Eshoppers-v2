import React from 'react'
import { format } from 'timeago.js'
import './message.css'

const Message = ({ message, own }) => {
  return (
    <div className={`message${own ? ' own' : ''}`}>
      <div className='messageTop'>
        <img
          className='messageImg'
          src='https://www.stepstherapy.com.au/wp-content/uploads/2018/10/Yazmin-profile-picture-square.jpg'
          alt='profileImage'
        />
        <p className='messageText'>{message.text}</p>
      </div>
      <div className='messageBottom'>{format(message.createdAt)}</div>
    </div>
  )
}

export default Message
