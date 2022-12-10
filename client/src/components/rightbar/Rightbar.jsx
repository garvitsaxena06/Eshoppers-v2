import './rightbar.css'
import Online from '../online/Online'
import { useEffect, useState } from 'react'
import { message } from 'antd'
import { useHistory } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import { Add, Remove, Edit, Chat } from '@material-ui/icons'
import UserInfoModal from '../modals/userInfo'
import { follow, unfollow } from '../../apiCalls'
import { useSelector, useDispatch } from 'react-redux'
import { followAction, unfollowAction } from '../../store/actions/userActions'

export default function Rightbar({
  user,
  onlineFriends,
  UpdateUserDetails = () => {},
  loadingFriends,
  loadingUserDetails = false,
  mobileView,
}) {
  const history = useHistory()
  const dispatch = useDispatch()
  const { user: currentUser } = useSelector((state) => state.user)
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?._id)
  )

  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id))
  }, [currentUser, user])

  const handleClick = async () => {
    try {
      if (followed) {
        unfollow(user._id, currentUser._id)
          .then((res) => {
            message.success('User has been unfollowed.')
            dispatch(unfollowAction(user._id))
          })
          .catch((err) => {
            console.log(err)
            message.error('Something went wrong!')
          })
      } else {
        follow(user._id, currentUser._id)
          .then((res) => {
            message.success('User has been followed.')
            dispatch(followAction(user._id))
          })
          .catch((err) => {
            console.log(err)
            message.error('Something went wrong!')
          })
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
        <img className='rightbarAd' src='assets/ad.jpg' alt='' />
        {onlineFriends?.length > 0 && (
          <h4 className='rightbarTitle fw-bold text-decoration-underline'>
            Online Users
          </h4>
        )}
        <ul className='rightbarFriendList'>
          {!loadingFriends
            ? onlineFriends?.map((u) => (
                <div
                  key={u._id}
                  onClick={() => history.push(`/messenger?q=${u._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <Online key={u._id} user={u} />
                </div>
              ))
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
      </>
    )
  }

  const ProfileRightbar = () => {
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const handleSubmit = (state) => {
      try {
        UpdateUserDetails(state, (err) => {
          if (!err) handleClose()
        })
      } catch (err) {
        console.log(err)
      }
    }

    return (
      <>
        {!loadingUserDetails ? (
          <>
            <div className='d-flex align-items-center'>
              {user.username !== currentUser.username && (
                <button className='rightbarFollowButton' onClick={handleClick}>
                  {followed ? 'Unfollow' : 'Follow'}
                  {followed ? <Remove /> : <Add />}
                </button>
              )}
              {followed && (
                <button
                  className='rightbarFollowButton ms-3'
                  onClick={() => history.push(`/messenger?q=${user?._id}`)}
                  title='Send Message'
                >
                  <Chat />
                </button>
              )}
            </div>
            <div className='profileEditContainer'>
              <div className='d-flex flex-column'>
                <h4 className='profileInfoName'>
                  <strong>{user.username && `@${user.username}`}</strong>
                </h4>
                <h4 className='rightbarTitle'>User information</h4>
              </div>
              {user.username === currentUser.username && (
                <button className='editButton' onClick={handleShow}>
                  <Edit />
                  {'Edit profile'}
                </button>
              )}
            </div>
            <div className='rightbarInfo'>
              <div className='rightbarInfoItem'>
                <span className='rightbarInfoKey'>First Name:</span>
                <span className='rightbarInfoValue'>
                  {user.firstName || 'N/A'}
                </span>
              </div>
              <div className='rightbarInfoItem'>
                <span className='rightbarInfoKey'>Last Name:</span>
                <span className='rightbarInfoValue'>
                  {user.lastName || 'N/A'}
                </span>
              </div>
              <div className='rightbarInfoItem'>
                <span className='rightbarInfoKey'>City:</span>
                <span className='rightbarInfoValue'>{user.city || 'N/A'}</span>
              </div>
            </div>
          </>
        ) : (
          <div>
            <div className='d-flex align-items-center pe-3 py-2'>
              <div>
                <Skeleton width={200} count={2} />
              </div>
              <div className='w-100 ps-3'>
                <Skeleton height={36} />
              </div>
            </div>
            <Skeleton count={3} width={200} />
            <Skeleton count={6} />
          </div>
        )}

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
    <div className={mobileView ? 'rightbarMobile' : 'rightbar'}>
      <div className='rightbarWrapper'>
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  )
}
