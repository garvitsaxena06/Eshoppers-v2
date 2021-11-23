import { useState, useEffect, useRef, useContext } from 'react'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import { AuthContext } from '../../context/AuthContext'
import './home.css'
import { useHistory } from 'react-router'
import { getFriends } from '../../apiCalls'
import { io } from 'socket.io-client'

export default function Home() {
  const history = useHistory()
  const socket = useRef()
  const { user } = useContext(AuthContext)
  const [friends, setFriends] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [onlineFriends, setOnlineFriends] = useState([])

  useEffect(() => {
    if (!user) {
      history.push('/')
    }
    // eslint-disable-next-line
  }, [user])

  useEffect(() => {
    socket.current = io('ws://localhost:8900')
    socket.current.on('getUsers', (users) => {
      setOnlineUsers(
        user.followings.filter((el) => users.some((u) => u.userId === el)),
      )
    })
  }, [user])

  useEffect(() => {
    getFriends(user._id)
      .then((res) => {
        setFriends(res.data)
      })
      .catch((err) => console.log(err))
  }, [user._id])

  useEffect(() => {
    setOnlineFriends(friends.filter((el) => onlineUsers.includes(el._id)))
  }, [onlineUsers, friends])

  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar onlineFriends={onlineFriends} friends={friends} />
        <Feed />
        <Rightbar onlineFriends={onlineFriends} friends={friends} />
      </div>
    </>
  )
}
