import { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import { AuthContext } from '../../context/Auth'
import './home.css'
import { useHistory } from 'react-router'
import { getFriends } from '../../apiCalls'

export default function Home() {
  const history = useHistory()
  const { user } = useContext(AuthContext)
  const { socket } = useSelector((state) => state)
  const { onlineUsers } = socket
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
  }, [user])

  useEffect(() => {
    setOnlineFriends(friends.filter((el) => onlineUsers?.includes(el._id)))
  }, [onlineUsers, friends])

  return (
    <>
      <Topbar />
      <div className='homeContainer'>
        <Sidebar />
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
