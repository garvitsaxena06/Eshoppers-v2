import { useContext } from 'react'
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
// import { Users } from '../../dummyData'
import CloseFriend from '../closeFriend/CloseFriend'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/Auth'

export default function Sidebar({ friends, onlineFriends }) {
  const { user } = useContext(AuthContext)
  const history = useHistory()

  return (
    <div className='sidebar'>
      <div className='sidebarWrapper'>
        <ul className='sidebarList'>
          <li
            className='sidebarListItem'
            onClick={() => history.push(`/profile/${user.username}`)}
          >
            <RssFeed className='sidebarIcon' />
            <span className='sidebarListItemText'>Feed</span>
          </li>
          <li
            className='sidebarListItem'
            onClick={() => history.push('/messenger')}
          >
            <Chat className='sidebarIcon' />
            <span className='sidebarListItemText'>Chats</span>
          </li>
          {/* <li className="sidebarListItem">
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <WorkOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li> */}
        </ul>
        {/* <button className="sidebarButton">Show More</button> */}
        <hr className='sidebarHr' />
        <ul className='sidebarFriendList'>
          {friends.map((u) => (
            <CloseFriend key={u._id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  )
}
