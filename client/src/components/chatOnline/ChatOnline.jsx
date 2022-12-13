import React, { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
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
  const [loadingFriends, setLoadingFriends] = useState(true)

  useEffect(() => {
    setLoadingFriends(true)
    getFriends(currentId)
      .then((res) => {
        setFriends(res.data)
        setLoadingFriends(false)
      })
      .catch((err) => {
        console.log(err)
        setLoadingFriends(false)
      })
  }, [currentId])

  useEffect(() => {
    setOnlineFriends(friends.filter((el) => onlineUsers?.includes(el._id)))
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
      .catch((err) => {
        console.log(err)
      })
  }

  const checkUserOnline = (id) => {
    return onlineFriends.some((el) => el._id === id)
  }

  return (
    <div className='chatOnline'>
      {!loadingFriends ? (
        friends.length > 0 ? (
          friends.map((el, i) => (
            <div
              key={i}
              className='chatOnlineFriend'
              onClick={() => openUserChat(el._id)}
            >
              <div className='chatOnlineImgContainer'>
                <img
                  className='chatOnlineImg'
                  src={
                    el?.profilePicture
                      ? el?.profilePicture
                      : 'https://d225jocw4xhwve.cloudfront.net/person/noAvatar.png'
                  }
                  alt='profileImage'
                />
                <div
                  className={`chatOnlineBadge${
                    checkUserOnline(el._id) ? ' online' : ''
                  }`}
                ></div>
              </div>
              <span className='chatOnlineName'>{el.username}</span>
            </div>
          ))
        ) : (
          <span className='noChatText'>
            You don't have any conversations yet.
          </span>
        )
      ) : (
        [...Array(3).keys()].map((el, i) => (
          <div key={i} className='d-flex align-items-center ps-2 pe-3 py-2'>
            <div>
              <Skeleton circle width={40} height={40} />
            </div>
            <div className='w-100 ps-3'>
              <Skeleton count={3} />
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default ChatOnline
