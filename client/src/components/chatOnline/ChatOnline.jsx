import React from 'react'
import './chatOnline.css'

const ChatOnline = () => {
  return (
    <div className='chatOnline'>
      <div className='chatOnlineFriend'>
        <div className='chatOnlineImgContainer'>
          <img
            className='chatOnlineImg'
            src='https://www.stepstherapy.com.au/wp-content/uploads/2018/10/Yazmin-profile-picture-square.jpg'
            alt='profileImage'
          />
          <div className='chatOnlineBadge'></div>
        </div>
        <span className='chatOnlineName'>John Doe</span>
      </div>
      <div className='chatOnlineFriend'>
        <div className='chatOnlineImgContainer'>
          <img
            className='chatOnlineImg'
            src='https://www.stepstherapy.com.au/wp-content/uploads/2018/10/Yazmin-profile-picture-square.jpg'
            alt='profileImage'
          />
          <div className='chatOnlineBadge'></div>
        </div>
        <span className='chatOnlineName'>John Doe</span>
      </div>
      <div className='chatOnlineFriend'>
        <div className='chatOnlineImgContainer'>
          <img
            className='chatOnlineImg'
            src='https://www.stepstherapy.com.au/wp-content/uploads/2018/10/Yazmin-profile-picture-square.jpg'
            alt='profileImage'
          />
          <div className='chatOnlineBadge'></div>
        </div>
        <span className='chatOnlineName'>John Doe</span>
      </div>
    </div>
  )
}

export default ChatOnline
