import React, { useContext, useState, useEffect, useRef } from 'react'
import './messenger.css'
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversation/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { AuthContext } from '../../context/AuthContext'
import { getConversations, getMessages, sendNewMessage } from '../../apiCalls'
import { Socket } from '../../utils/socket'

const Messenger = () => {
  const [AllConversations, setAllConversations] = useState([])
  const [conversations, setConversations] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const socket = useRef(Socket).current
  const { user } = useContext(AuthContext)
  const scrollRef = useRef()

  useEffect(() => {
    const handleMessages = ({ senderId, text }) => {
      setArrivalMessage({
        sender: senderId,
        text,
        createdAt: Date.now(),
      })
    }

    const handleConversations = ({ senderId, conversation }) => {
      setAllConversations((prev) => [...prev, conversation])
      setConversations((prev) => [...prev, conversation])
    }

    // socket = io('ws://localhost:8900')
    socket.on('getMessage', handleMessages)
    socket.on('getConversation', handleConversations)
    return () => {
      socket.off('getMessage', handleMessages)
      socket.off('receive_conversation', handleConversations)
    }
  }, [socket])

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage])
  }, [arrivalMessage, currentChat])

  useEffect(() => {
    const handleUsers = (users) => {
      setOnlineUsers(
        user.followings.filter((el) => users.some((u) => u.userId === el)),
      )
    }
    socket.emit('addUser', user._id)
    socket.on('getUsers', handleUsers)
    return () => {
      socket.off('getUsers', handleUsers)
    }
  }, [user, socket])

  useEffect(() => {
    getConversations(user._id)
      .then((res) => {
        setAllConversations(res.data)
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
    if (newMessage) {
      sendNewMessage({
        conversationId: currentChat._id,
        sender: user._id,
        text: newMessage,
      })
        .then((res) => {
          setNewMessage('')
          setMessages([...messages, res.data])

          const receiverId = currentChat.members?.find((el) => el !== user._id)
          socket.emit('sendMessage', {
            senderId: user._id,
            receiverId,
            text: newMessage,
          })
        })
        .catch((err) => console.log(err))
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleChange = (event) => {
    const { value } = event.target
    if (value === '') setConversations(AllConversations)
    else {
      const filteredConversations = AllConversations.filter((con) => {
        if (
          con?.member?.username
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase())
        )
          return con
        return 0
      })
      setConversations(filteredConversations)
    }
  }

  const updateConversations = (data) => {
    socket.emit('addConversation', data)
  }

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              placeholder="Search for friends"
              className="chatMenuInput"
              onChange={handleChange}
            />
            {conversations.map((el, i) => (
              <div key={i} onClick={() => setCurrentChat(el)}>
                <Conversation
                  AllConversations={AllConversations}
                  setAllConversations={setAllConversations}
                  conversation={el}
                  currentUser={user}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((el, i) => (
                    <div key={i} ref={scrollRef}>
                      <Message message={el} own={el.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="Write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button
                    className="chatSubmitBtn"
                    onClick={sendMessageHandler}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
              updateConversations={updateConversations}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Messenger
