import { useState, useEffect, useContext } from 'react'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import { AuthContext } from '../../context/Auth'
import { SocketContext } from '../../context/Socket'
import './home.css'
import { useHistory } from 'react-router'
import { getFriends } from '../../apiCalls'

export default function Home() {
  const history = useHistory()
  const { user } = useContext(AuthContext)
  const { onlineUsers } = useContext(SocketContext)
  const [friends, setFriends] = useState([])
  const [onlineFriends, setOnlineFriends] = useState([])
  const [loadingFriends, setLoadingFriends] = useState(true)

  useEffect(() => {
    if (!user) {
      history.push('/')
    }
  }, [user, history])

  useEffect(() => {
    setLoadingFriends(true)
    getFriends(user._id)
      .then((res) => {
        setFriends(res.data)
        setLoadingFriends(false)
      })
      .catch((err) => {
        console.log(err)
        setLoadingFriends(false)
      })
  }, [user._id])

  useEffect(() => {
    setOnlineFriends(friends.filter((el) => onlineUsers?.includes(el._id)))
  }, [onlineUsers, friends])

  return (
    <>
      <Topbar />
      <div className='homeContainer'>
        <Sidebar
          onlineFriends={onlineFriends}
          friends={friends}
          loadingFriends={loadingFriends}
        />
        <Feed />
        <Rightbar
          onlineFriends={onlineFriends}
          friends={friends}
          loadingFriends={loadingFriends}
        />
      </div>
    </>
  )
}
