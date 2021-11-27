import React, { useContext, useState, useEffect, useRef } from 'react'
import './messenger.css'
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversation/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { AuthContext } from '../../context/Auth'
import { SocketContext } from '../../context/Socket'
import useSocket from '../../socket'
import {
  getConversations,
  getMessages,
  sendNewMessage,
  getUserById,
  getConversationByOfTwoUsers,
} from '../../apiCalls'
import { Encrypt, Decrypt, DeriveKeys } from '../../utils/crypto'
import Skeleton from 'react-loading-skeleton'
import { message } from 'antd'
import { useLocation } from 'react-router'

const Messenger = () => {
  const { socket } = useSocket()
  const [AllConversations, setAllConversations] = useState([])
  const [conversations, setConversations] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [friend, setFriend] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [decryptionKeys, setDecryptionKeys] = useState()
  const [loadingConversations, setLoadingConversations] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const { user } = useContext(AuthContext)
  const { onlineUsers, arrivalMessage, newConversation } =
    useContext(SocketContext)
  const scrollRef = useRef()

  const friendId = useLocation().search?.split('=')[1]

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage])
  }, [arrivalMessage, currentChat])

  useEffect(() => {
    if (newConversation) {
      const { conversation } = newConversation
      setConversations((prev) => [...prev, conversation])
      setAllConversations((prev) => [...prev, conversation])
    }
  }, [newConversation])

  useEffect(() => {
    setLoadingConversations(true)
    getConversations(user._id)
      .then((res) => {
        setAllConversations(res.data)
        setConversations(res.data)
        setLoadingConversations(false)
      })
      .catch((err) => {
        console.log(err)
        setLoadingConversations(false)
        message.error('Something went wrong!')
      })
  }, [user._id])

  useEffect(() => {
    setLoadingMessages(true)
    if (currentChat) {
      getUserById(currentChat?.members?.find((el) => el !== user._id))
        .then((res) => {
          setFriend(res.data)
        })
        .catch((err) => console.log(err))
    }
    getMessages(currentChat?._id)
      .then((res) => {
        setMessages(res.data)
        setLoadingMessages(false)
      })
      .catch((err) => {
        console.log(err)
        setLoadingMessages(false)
        message.error('Something went wrong!')
      })
  }, [currentChat, user])

  useEffect(() => {
    DeriveKeys(friend?.publicKeyJwk, user?.privateKeyJwk).then((res) => {
      setDecryptionKeys(res)
    })
  }, [friend, user])

  const sendMessageHandler = async (e) => {
    e.preventDefault()
    const encryptedMessages = await Encrypt(newMessage, decryptionKeys)
    if (newMessage) {
      sendNewMessage({
        conversationId: currentChat._id,
        sender: user._id,
        text: encryptedMessages,
      })
        .then((res) => {
          setNewMessage('')
          setMessages([...messages, res.data])

          const receiverId = currentChat.members?.find((el) => el !== user._id)
          socket.current.emit('sendMessage', {
            senderId: user._id,
            receiverId,
            text: encryptedMessages,
          })
        })
        .catch((err) => {
          console.log(err)
          message.error('Something went wrong!')
        })
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loadingMessages])

  const handleChange = (event) => {
    setLoadingConversations(true)
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
    setLoadingConversations(false)
  }

  const updateConversations = (data) => {
    socket.current.emit('addConversation', data)
  }

  useEffect(() => {
    if (friendId) {
      getConversationByOfTwoUsers(user._id, friendId)
        .then((res) => {
          if (res.data.new)
            updateConversations({
              senderId: user._id,
              receiverId: friendId,
              conversation: res.data.data,
            })
          setCurrentChat(res.data.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    // eslint-disable-next-line
  }, [friendId, user])

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
              onChange={handleChange}
            />
            {!loadingConversations ? (
              conversations.length > 0 ? (
                conversations.map((el, i) => (
                  <div key={i} onClick={() => setCurrentChat(el)}>
                    <Conversation
                      AllConversations={AllConversations}
                      setAllConversations={setAllConversations}
                      conversation={el}
                      currentUser={user}
                    />
                  </div>
                ))
              ) : (
                <span className='noChatText'>
                  You don't have any conversations yet.
                </span>
              )
            ) : (
              [...Array(3).keys()].map((el, i) => (
                <div
                  key={i}
                  className='d-flex align-items-center ps-2 pe-3 py-2'
                >
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
        </div>
        <div className='chatBox'>
          <div className='chatBoxWrapper'>
            {currentChat ? (
              <>
                <div className='chatBoxTop'>
                  {!loadingMessages ? (
                    messages.length > 0 ? (
                      messages.map((el, i) => (
                        <div key={i} ref={scrollRef}>
                          <Message
                            derivedKeys={decryptionKeys}
                            Decrypt={Decrypt}
                            message={el}
                            friend={friend}
                            own={el.sender === user._id}
                          />
                        </div>
                      ))
                    ) : (
                      <span className='noConversationText'>
                        Write your first message to {friend?.username}...
                      </span>
                    )
                  ) : (
                    [...Array(6).keys()].map((el, i) => (
                      <div
                        key={i}
                        className={`d-flex align-items-center ps-2 pe-3 py-2 w-50 ${
                          i % 2 === 0 ? 'ms-auto' : ''
                        }`}
                      >
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
