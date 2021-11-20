import React from 'react'
import './message.css'

const Message = ({ own }) => {
  return (
    <div className={`message ${own && 'own'}`}>
      <div className='messageTop'>
        <img
          className='messageImg'
          src='https://www.stepstherapy.com.au/wp-content/uploads/2018/10/Yazmin-profile-picture-square.jpg'
          alt='profileImage'
        />
        <p className='messageText'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </div>
      <div className='messageBottom'>1 hour ago</div>
    </div>
  )
}

export default Message
