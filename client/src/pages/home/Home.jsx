import { useState, useEffect, useRef, useContext } from 'react'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import { AuthContext } from '../../context/AuthContext'
import './home.css'
import { useHistory } from 'react-router'
import { getFriends } from '../../apiCalls'
import { Socket } from '../../utils/socket'


export default function Home() {
  const history = useHistory()
  const socket = useRef(Socket).current
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
    // socket = io('ws://localhost:8900')
    const handleUsers = (users) => {
      setOnlineUsers(
        user.followings.filter((el) => users.some((u) => u.userId === el)),
      )
    }
    socket.emit('addUser', user?._id)
    socket.on('getUsers', handleUsers)
    return () => {
      socket.off('getUsers', handleUsers)
    }
  }, [user, socket])

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
