import './profile.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import { AuthContext } from '../../context/Auth'
import { getFriends, updateUser } from '../../apiCalls'
import { CameraAlt, Edit } from '@material-ui/icons'
import { upload } from '../../utils/upload'
import { message } from 'antd'
import { Spinner } from 'react-bootstrap'

export default function Profile() {
  const [user, setUser] = useState({})
  const { user: loggedInUser, dispatch } = useContext(AuthContext)
  const [loading, setLoading] = useState({
    coverPicture: false,
    profilePicture: false,
  })
  const [loadingUserDetails, setLoadingUserDetails] = useState(false)
  const [friends, setFriends] = useState([])
  const username = useParams().username

  useEffect(() => {
    setLoadingUserDetails(true)
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`)
      setUser(res.data)
    }
    fetchUser()
    setLoadingUserDetails(false)
  }, [username])

  useEffect(() => {
    getFriends(loggedInUser._id)
      .then((res) => {
        setFriends(res.data)
      })
      .catch((err) => console.log(err))
  }, [loggedInUser._id])

  const UpdateUserDetails = (state, cb = () => {}) => [
    updateUser({ ...state, userId: user._id })
      .then((res) => {
        cb(false, res)
        setUser(res.data.data)
        dispatch({ type: 'UPDATE', payload: res.data.data })
        setLoading({ coverPicture: false, profilePicture: false })
        message.success(res?.data?.message || 'Profile updated successfully')
      })
      .catch((err) => {
        console.log(err)
      }),
  ]

  const handleFileUpload = (file, name) => {
    upload(file, (err, response) => {
      if (!err) {
        setLoading({ ...loading, [name]: true })
        UpdateUserDetails({ [name]: response })
      } else {
        message.error(err?.message || 'Something went wrong!')
      }
    })
  }

  return (
    <>
      <Topbar />
      <div className='profile'>
        <Sidebar friends={friends} />
        <div className='profileRight'>
          <div className='profileRightTop'>
            <div className='profileCover'>
              <div>
                <img
                  className='profileCoverImg'
                  src={
                    user.coverPicture
                      ? user.coverPicture.replace(
                          's3.ap-south-1.amazonaws.com/social-app-assets',
                          'd225jocw4xhwve.cloudfront.net'
                        )
                      : 'https://d225jocw4xhwve.cloudfront.net/pexels-lina-kivaka-2337491.jpg'
                  }
                  alt=''
                />
                {loading.coverPicture && (
                  <Spinner animation='border' variant='primary' />
                )}
                {user.username === loggedInUser.username && (
                  <div>
                    <label htmlFor='cover' className='shareOption'>
                      <div className='editCoverImage'>
                        <Edit />
                        {' Edit Cover Photo'}
                      </div>
                      <input
                        style={{ display: 'none' }}
                        type='file'
                        id='cover'
                        accept='.png,.jpeg,.jpg'
                        onChange={(e) =>
                          handleFileUpload(e.target.files[0], 'coverPicture')
                        }
                      />
                    </label>
                  </div>
                )}
              </div>
              <div className='profileUserImgContainer'>
                {loading.profilePicture ? (
                  <Spinner
                    animation='border'
                    className='profileUserImg'
                    variant='primary'
                  />
                ) : (
                  <img
                    className='profileUserImg'
                    src={
                      user.profilePicture
                        ? user.profilePicture
                        : 'https://d225jocw4xhwve.cloudfront.net/person/noAvatar.png'
                    }
                    alt=''
                  />
                )}
                {user.username === loggedInUser.username && (
                  <div>
                    <label htmlFor='file' className='shareOption'>
                      <div className='editProfileImage'>
                        <CameraAlt style={{ fontSize: '20px' }}></CameraAlt>
                      </div>
                      <input
                        style={{ display: 'none' }}
                        type='file'
                        id='file'
                        accept='.png,.jpeg,.jpg'
                        onChange={(e) =>
                          handleFileUpload(e.target.files[0], 'profilePicture')
                        }
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='profileRightBottom'>
            <Feed username={username} user={user} />
            <Rightbar
              user={user}
              UpdateUserDetails={UpdateUserDetails}
              loadingUserDetails={loadingUserDetails}
            />
          </div>
        </div>
      </div>
    </>
  )
}
