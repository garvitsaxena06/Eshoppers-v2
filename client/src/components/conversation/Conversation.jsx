import React, { useEffect, useState } from 'react'
import { getUserById } from '../../apiCalls'
import './conversation.css'

const Conversation = ({
  conversation,
  currentUser,
  setAllConversations,
  AllConversations,
}) => {
  const [user, setUser] = useState(null)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  useEffect(() => {
    const friendId = conversation.members?.find((el) => el !== currentUser._id)

    getUserById(friendId)
      .then((res) => {
        setUser(res.data)
        const newConversations = AllConversations.map((el) => {
          if (el.members.includes(res.data._id)) el.member = res.data
          return el
        })
        setAllConversations(newConversations)
      })
      .catch((err) => console.log(err))
    // eslint-disable-next-line
  }, [currentUser, conversation])

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={
          user?.profilePicture
            ? user?.profilePicture
            : PF + 'person/noAvatar.png'
        }
        alt="profileImage"
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  )
}

export default Conversation
