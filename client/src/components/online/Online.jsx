import './online.css'

export default function Online({ user, online = true }) {
  return (
    <li className='rightbarFriend'>
      <div className='rightbarProfileImgContainer'>
        <img
          className='rightbarProfileImg'
          src={
            user.profilePicture !== ''
              ? user.profilePicture
              : 'https://d225jocw4xhwve.cloudfront.net/person/noAvatar.png'
          }
          alt=''
        />
        <span className={online ? 'rightbarOnline' : 'rightbarOffline'}></span>
      </div>
      <span className='rightbarUsername'>{user.username}</span>
    </li>
  )
}
