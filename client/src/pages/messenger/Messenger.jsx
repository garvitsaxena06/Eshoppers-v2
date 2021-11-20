import React, { useContext, useState, useEffect } from 'react'
import './messenger.css'
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversation/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { AuthContext } from '../../context/AuthContext'
import { getConversations } from '../../apiCalls'

const Messenger = () => {
  const [conversations, setConversations] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    getConversations(user._id)
      .then((res) => {
        setConversations(res.data)
      })
      .catch((err) => console.log(err))
  }, [user._id])

  return (
    <>
      <Topbar />
      <div className='messenger'>
        <div className='chatMenu'>
          <div className='chatMenuWrapper'>
            <input
              type='text'
              placeholder='Search for friends'
              className='chatMenuInput'
            />
            {conversations.map((el) => (
              <Conversation conversation={el} currentUser={user} />
            ))}
          </div>
        </div>
        <div className='chatBox'>
          <div className='chatBoxWrapper'>
            <div className='chatBoxTop'>
              <Message />
              <Message />
              <Message own={true} />
              <Message />
              <Message />
              <Message />
              <Message />
              <Message />
              <Message />
              <Message />
              <Message />
              <Message />
              <Message />
              <Message />
              <Message />
              <Message />
              <Message />
            </div>
            <div className='chatBoxBottom'>
              <textarea
                className='chatMessageInput'
                placeholder='Write something...'
              ></textarea>
              <button className='chatSubmitBtn'>Send</button>
            </div>
          </div>
        </div>
        <div className='chatOnline'>
          <div className='chatOnlineWrapper'>
            <ChatOnline />
          </div>
        </div>
      </div>
    </>
  )
}

export default Messenger
