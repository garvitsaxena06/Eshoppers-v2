import React from 'react'
import './conversation.css'

const Conversation = () => {
  return (
    <div className='conversation'>
      <img
        className='conversationImg'
        src='https://www.stepstherapy.com.au/wp-content/uploads/2018/10/Yazmin-profile-picture-square.jpg'
        alt='profileImage'
      />
      <span className='conversationName'>John Doe</span>
    </div>
  )
}

export default Conversation
