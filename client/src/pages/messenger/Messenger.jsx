import React, { useContext, useState, useEffect, useRef } from 'react'
import './messenger.css'
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversation/Conversation'
import Message from '../../components/message/Message'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import { AuthContext } from '../../context/Auth'
import { SocketContext } from '../../context/Socket'
import useSocket from '../../utils/socket'
import {
  getConversations,
  getMessages,
  sendNewMessage,
  getUserById,
  getConversationByOfTwoUsers,
} from '../../apiCalls'
import { Encrypt, Decrypt, DeriveKeys } from '../../utils/crypto'
import Skeleton from 'react-loading-skeleton'
import { message, Switch, Tooltip, Upload, Modal } from 'antd'
import { useLocation } from 'react-router'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace'
import useWindowSize from '../../utils/windowSize'
import { IconButton } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import { upload } from '../../utils/upload'

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
  const [encryptMessages, setEncryptMessages] = useState(false)
  const [sendFile, setSendFile] = useState(null)
  const [sendingFile, setSendingFile] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { user } = useContext(AuthContext)
  const width = useWindowSize()
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
        if (res.data && res.data.length > 0)
          setMessages(
            res.data.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            )
          )
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

  const sendMessageHandler = async (e, url) => {
    e?.preventDefault()
    const encryptedMessages = await Encrypt(url ?? newMessage, decryptionKeys)
    if (url || newMessage) {
      sendNewMessage({
        conversationId: currentChat._id,
        sender: user._id,
        text: encryptedMessages,
      })
        .then((res) => {
          setNewMessage('')
          setSendingFile(false)
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
  }, [messages, encryptMessages])

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

  const closeModal = () => {
    setIsVisible(false)
    setSendFile(null)
  }

  const fileChangeHandler = (file) => {
    if (file.file?.originFileObj) {
      setSendFile(file.file?.originFileObj)
      setIsVisible(true)
      setSendingFile(true)
    }
  }

  const fileTypeCheckHandler = (file) => {
    const acceptedFileType = ['image/png', 'image/jpeg', 'image/jpg']
    if (!acceptedFileType.includes(file.type)) {
      message.error(`${file.name} is not an image file!`)
      return false
    }
    return true
  }

  const sendImageHandler = () => {
    upload(sendFile, (err, response) => {
      if (!err) {
        sendMessageHandler(null, response)
        closeModal()
      } else {
        message.error(err?.message || 'Please try again later.')
      }
    })
  }

  return (
    <>
      <Topbar />
      <div className={`messenger ${width < 783 ? 'messengerMobile' : ''}`}>
        <div
          className={`chatMenu ${
            width < 783 && !currentChat ? 'chatMenuMobile' : ''
          }`}
        >
          <div className='chatMenuWrapper'>
            <h5 className='sectionTitle'>Your recent conversations</h5>
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
        <div
          className={`chatBox ${
            width < 783 && currentChat ? 'chatBoxMobile' : ''
          }`}
        >
          <div className='chatBoxWrapper'>
            {currentChat && (
              <div className='chatBoxHeader d-flex justify-content-between align-items-center'>
                <IconButton onClick={() => setCurrentChat(null)}>
                  <KeyboardBackspaceIcon
                    style={{ color: '#5e5e5e', fontSize: 28 }}
                  />
                </IconButton>
                <Tooltip
                  overlayStyle={{ whiteSpace: 'pre-line', fontSize: 13 }}
                  title={`Enable this if you want to see the encrypt message`}
                  placement='bottom'
                >
                  <Switch onChange={(checked) => setEncryptMessages(checked)} />
                </Tooltip>
              </div>
            )}
            {currentChat ? (
              <>
                <div className='chatBoxTop'>
                  {loadingMessages &&
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
                    ))}
                  {messages.length > 0 ? (
                    messages.map((el, i) => (
                      <div key={i} ref={scrollRef}>
                        <Message
                          encryptMessages={encryptMessages}
                          derivedKeys={decryptionKeys}
                          Decrypt={Decrypt}
                          message={el}
                          setSendFile={setSendFile}
                          setIsVisible={setIsVisible}
                          friend={friend}
                          own={el.sender === user._id}
                        />
                      </div>
                    ))
                  ) : (
                    <span className='noConversationText'>
                      {!loadingMessages &&
                        `Write your first message to ${friend?.username}...`}
                    </span>
                  )}
                </div>
                <div className='chatBoxBottom'>
                  <textarea
                    className='chatMessageInput'
                    placeholder='Write something...'
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                    rows={1}
                  ></textarea>

                  <Upload
                    accept='image/*'
                    name='file'
                    onChange={fileChangeHandler}
                    beforeUpload={fileTypeCheckHandler}
                  >
                    <button className='chatFileAttachBtn'>
                      <AttachFileIcon />
                    </button>
                  </Upload>

                  <button
                    className='chatSubmitBtn'
                    onClick={sendMessageHandler}
                  >
                    <SendIcon style={{ color: '#fff' }} />
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
            <h5 className='sectionTitle'>Your friends</h5>
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
              updateConversations={updateConversations}
            />
          </div>
        </div>
      </div>
      <Modal
        visible={isVisible}
        onCancel={closeModal}
        footer={null}
        width={450}
        className='imageModal'
      >
        <div className='modalImageContainer'>
          {sendFile && (
            <img
              src={
                typeof sendFile === 'object'
                  ? URL.createObjectURL(sendFile)
                  : sendFile
              }
              alt=''
            />
          )}
        </div>
        {sendingFile && (
          <button
            className='chatSubmitBtn imgSendBtn'
            onClick={sendImageHandler}
          >
            <SendIcon style={{ color: '#fff' }} />
          </button>
        )}
      </Modal>
    </>
  )
}

export default Messenger
