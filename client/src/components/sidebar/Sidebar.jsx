import { useEffect, useState } from 'react'
import './sidebar.css'
import {
  RssFeed,
  Chat,
  // PlayCircleFilledOutlined,
  // Group,
  // Bookmark,
  // HelpOutline,
  // WorkOutline,
  // Event,
  // School,
} from '@material-ui/icons'
import Skeleton from 'react-loading-skeleton'
// import { Users } from '../../dummyData'
import CloseFriend from '../closeFriend/CloseFriend'
import { useHistory } from 'react-router-dom'
import { getFriends } from '../../apiCalls'
import { useSelector } from 'react-redux'

export default function Sidebar() {
  const { user } = useSelector((state) => state.user)
  const history = useHistory()

  const [friends, setFriends] = useState([])
  const [loadingFriends, setLoadingFriends] = useState(true)

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

  return (
    <div className='sidebar'>
      <div className='sidebarWrapper'>
        <ul className='sidebarList'>
          <li
            className='sidebarListItem'
            onClick={() => history.push(`/profile/${user.username}`)}
          >
            <RssFeed className='sidebarIcon' />
            <span className='sidebarListItemText'>Shopping</span>
          </li>
          <li
            className='sidebarListItem'
            onClick={() => history.push('/messenger')}
          >
            <Chat className='sidebarIcon' />
            <span className='sidebarListItemText'>Chats</span>
          </li>
        </ul>
        {/* <button className="sidebarButton">Show More</button> */}
        <hr className='sidebarHr' />
        <ul className='sidebarFriendList'>
          {!loadingFriends
            ? friends.map((u) => <CloseFriend key={u._id} user={u} />)
            : [...Array(3).keys()].map((el, i) => (
                <div key={i} className='d-flex align-items-center pe-3 py-2'>
                  <div>
                    <Skeleton circle width={40} height={40} />
                  </div>
                  <div className='w-100 ps-3'>
                    <Skeleton count={3} />
                  </div>
                </div>
              ))}
        </ul>
      </div>
    </div>
  )
}
