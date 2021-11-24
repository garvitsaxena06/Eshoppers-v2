import React, { useEffect, useState } from 'react'
import { getConversationByOfTwoUsers, getFriends } from '../../apiCalls'
import './chatOnline.css'

const ChatOnline = ({
  onlineUsers,
  currentId,
  setCurrentChat,
  updateConversations = () => {},
}) => {
  const [friends, setFriends] = useState([])
  const [onlineFriends, setOnlineFriends] = useState([])
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  useEffect(() => {
    getFriends(currentId)
      .then((res) => {
        setFriends(res.data)
      })
      .catch((err) => console.log(err))
  }, [currentId])

  useEffect(() => {
    setOnlineFriends(friends.filter((el) => onlineUsers.includes(el._id)))
  }, [onlineUsers, friends])

  const openUserChat = (userId) => {
    getConversationByOfTwoUsers(currentId, userId)
      .then((res) => {
        if (res.data.new)
          updateConversations({
            senderId: currentId,
            receiverId: userId,
            conversation: res.data.data,
          })
        setCurrentChat(res.data.data)
      })
      .catch((err) => console.log(err))
  }

  const checkUserOnline = (id) => {
    return onlineFriends.some((el) => el._id === id)
  }

  return (
    <div className="chatOnline">
      {friends.map((el, i) => (
        <div
          key={i}
          className="chatOnlineFriend"
          onClick={() => openUserChat(el._id)}
        >
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                el?.profilePicture
                  ? el?.profilePicture
                  : PF + 'person/noAvatar.png'
              }
              alt="profileImage"
            />
            <div
              className={`chatOnlineBadge${
                checkUserOnline(el._id) ? ' online' : ''
              }`}
            ></div>
          </div>
          <span className="chatOnlineName">{el.username}</span>
        </div>
      ))}
    </div>
  )
}

export default ChatOnline
