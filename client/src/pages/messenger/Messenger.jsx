import React, { useContext, useState, useEffect } from 'react'
import './messenger.css'
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversation/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { AuthContext } from '../../context/AuthContext'
import { getConversations, getMessages, sendNewMessage } from '../../apiCalls'

const Messenger = () => {
  const [conversations, setConversations] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const { user } = useContext(AuthContext)

  useEffect(() => {
    getConversations(user._id)
      .then((res) => {
        setConversations(res.data)
      })
      .catch((err) => console.log(err))
  }, [user._id])

  useEffect(() => {
    getMessages(currentChat?._id)
      .then((res) => {
        setMessages(res.data)
      })
      .catch((err) => console.log(err))
  }, [currentChat])

  const sendMessageHandler = (e) => {
    e.preventDefault()
    sendNewMessage({
      conversationId: currentChat._id,
      sender: user._id,
      text: newMessage,
    })
      .then((res) => {
        console.log('Message sent')
        setMessages([...messages, res.data])
      })
      .catch((err) => console.log(err))
  }

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
              <div onClick={() => setCurrentChat(el)}>
                <Conversation conversation={el} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className='chatBox'>
          <div className='chatBoxWrapper'>
            {currentChat ? (
              <>
                <div className='chatBoxTop'>
                  {messages.map((el) => (
                    <Message message={el} own={el.sender === user._id} />
                  ))}
                </div>
                <div className='chatBoxBottom'>
                  <textarea
                    className='chatMessageInput'
                    placeholder='Write something...'
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button
                    className='chatSubmitBtn'
                    onClick={sendMessageHandler}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className='noConversationText'>
                Open a conversation to start a chat.
              </span>
            )}
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
