import './closeFriend.css'
import { useHistory } from 'react-router'

export default function CloseFriend({ user }) {
  const history = useHistory()
  return (
    <li
      className='sidebarFriend'
      onClick={() => history.push('/profile/' + user.username)}
    >
      <img
        className='sidebarFriendImg'
        src={
          user.profilePicture !== ''
            ? user.profilePicture.replace(
                's3.ap-south-1.amazonaws.com/social-app-assets',
                'd225jocw4xhwve.cloudfront.net'
              )
            : 'https://d225jocw4xhwve.cloudfront.net/person/noAvatar.png'
        }
        alt=''
      />
      <span className='sidebarFriendName'>{user.username}</span>
    </li>
  )
}
