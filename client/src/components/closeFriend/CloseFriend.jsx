import './closeFriend.css'
import { useHistory } from 'react-router'

export default function CloseFriend({ user }) {
  const history = useHistory()
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  return (
    <li
      className="sidebarFriend"
      onClick={() => history.push('/profile/' + user.username)}
    >
      <img
        className="sidebarFriendImg"
        src={
          user.profilePicture !== ''
            ? PF + user.profilePicture
            : PF + 'person/noAvatar.png'
        }
        alt=""
      />
      <span className="sidebarFriendName">{user.username}</span>
    </li>
  )
}
