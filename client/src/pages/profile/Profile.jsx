import './profile.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'
import { AuthContext } from '../../context/AuthContext'
import { getFriends } from '../../apiCalls'
import { CameraAlt } from '@material-ui/icons'
export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [user, setUser] = useState({})
  const { user: loggedInUser } = useContext(AuthContext)
  const [friends, setFriends] = useState([])
  const [file, setFile] = useState(null)
  const username = useParams().username

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`)
      setUser(res.data)
    }
    fetchUser()
  }, [username])

  useEffect(() => {
    getFriends(loggedInUser._id)
      .then((res) => {
        setFriends(res.data)
      })
      .catch((err) => console.log(err))
  }, [loggedInUser._id])

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar friends={friends} />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + 'person/noCover.png'
                }
                alt=""
              />
              <div className="profileUserImgContainer">
                <img
                  className="profileUserImg"
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + 'person/noAvatar.png'
                  }
                  alt=""
                />
                <div>
                  <label htmlFor="file" className="shareOption">
                    <div className="editProfileImage">
                      <CameraAlt style={{ fontSize: '20px' }}></CameraAlt>
                    </div>
                    <input
                      style={{ display: 'none' }}
                      type="file"
                      id="file"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  )
}
