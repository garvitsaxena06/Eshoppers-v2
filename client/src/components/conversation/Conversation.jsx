import React, { useEffect, useState } from 'react'
import { getUserById } from '../../apiCalls'
import './conversation.css'

const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState(null)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  useEffect(() => {
    const friendId = conversation.member.find((el) => el !== currentUser._id)

    getUserById(friendId)
      .then((res) => {
        setUser(res.data)
      })
      .catch((err) => console.log(err))
  }, [currentUser, conversation])

  return (
    <div className='conversation'>
      <img
        className='conversationImg'
        src={user.profilePicture ?? PF + 'person/noAvatar.png'}
        alt='profileImage'
      />
      <span className='conversationName'>{user.username}</span>
    </div>
  )
}

export default Conversation
