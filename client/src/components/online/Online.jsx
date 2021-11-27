import './online.css'

export default function Online({ user }) {
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
        <span className='rightbarOnline'></span>
      </div>
      <span className='rightbarUsername'>{user.username}</span>
    </li>
  )
}
