import './rightbar.css'
import Online from '../online/Online'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/Auth'
import { Add, Remove, Edit } from '@material-ui/icons'
import UserInfoModal from '../modals/userInfo'

export default function Rightbar({
  user,
  onlineFriends,
  UpdateUserDetails = () => {},
}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [friends, setFriends] = useState([])
  const { user: currentUser, dispatch } = useContext(AuthContext)
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?._id)
  )

  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id))
  }, [currentUser, user])

  useEffect(() => {
    const getFriends = async () => {
      if (user && user.username) {
        try {
          const friendList = await axios.get(
            '/users/friendsByUserName/' + user.username
          )
          setFriends(friendList.data)
        } catch (err) {
          console.log(err)
        }
      } else {
        try {
          const friendList = await axios.get(
            '/users/friends/' + currentUser?._id
          )
          setFriends(friendList.data)
        } catch (err) {
          console.log(err)
        }
      }
    }
    getFriends()
  }, [currentUser?._id, user])

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        })
        dispatch({ type: 'UNFOLLOW', payload: user._id })
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        })
        dispatch({ type: 'FOLLOW', payload: user._id })
      }
      setFollowed(!followed)
    } catch (err) {}
  }

  const HomeRightbar = () => {
    return (
      <>
        {/* <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div> */}
        <img className='rightbarAd' src='assets/ad.png' alt='' />
        {onlineFriends.length > 0 && (
          <h4 className='rightbarTitle'>Online Friends</h4>
        )}
        <ul className='rightbarFriendList'>
          {onlineFriends.map((u) => (
            <Online key={u._id} user={u} />
          ))}
        </ul>
      </>
    )
  }

  const ProfileRightbar = () => {
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const handleSubmit = (state) => {
      console.log(state)
      try {
        UpdateUserDetails(state, (err) => {
          if (!err) handleClose()
        })
      } catch (error) {
        console.log(error)
      }
    }

    return (
      <>
        {user.username !== currentUser.username && (
          <button className='rightbarFollowButton' onClick={handleClick}>
            {followed ? 'Unfollow' : 'Follow'}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <div className='d-flex justify-content-between'>
          <h4 className='rightbarTitle'>User information</h4>
          {user.username === currentUser.username && (
            <button className='editButton' onClick={handleShow}>
              <Edit />
              {' Edit profile'}
            </button>
          )}
        </div>
        <div className='rightbarInfo'>
          <div className='rightbarInfoItem'>
            <span className='rightbarInfoKey'>First Name:</span>
            <span className='rightbarInfoValue'>{user.firstName}</span>
          </div>
          <div className='rightbarInfoItem'>
            <span className='rightbarInfoKey'>Last Name:</span>
            <span className='rightbarInfoValue'>{user.lastName}</span>
          </div>
          <div className='rightbarInfoItem'>
            <span className='rightbarInfoKey'>City:</span>
            <span className='rightbarInfoValue'>{user.city}</span>
          </div>
        </div>
        <h4 className='rightbarTitle'>User friends</h4>
        <div className='rightbarFollowings'>
          {friends.map((friend) => (
            <Link
              key={friend.username}
              to={'/profile/' + friend.username}
              style={{ textDecoration: 'none' }}
            >
              <div className='rightbarFollowing'>
                <img
                  src={
                    friend.profilePicture
                      ? friend.profilePicture
                      : PF + 'person/noAvatar.png'
                  }
                  alt=''
                  className='rightbarFollowingImg'
                />
                <span className='rightbarFollowingName'>{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
        <UserInfoModal
          show={show}
          user={user}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
        />
      </>
    )
  }
  return (
    <div className='rightbar'>
      <div className='rightbarWrapper'>
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  )
}
