import './post.css'
import { MoreVert } from '@material-ui/icons'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { format } from 'timeago.js'
import { Link, useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/Auth'
import { Menu, Dropdown } from 'antd'

export default function Post({ post, fetchPosts }) {
  const [like, setLike] = useState(post.likes.length)
  const [isLiked, setIsLiked] = useState(false)
  const [user, setUser] = useState({})
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const { user: currentUser } = useContext(AuthContext)
  const history = useHistory()

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id))
  }, [currentUser._id, post.likes])

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`)
      setUser(res.data)
    }
    fetchUser()
  }, [post.userId])

  const likeHandler = () => {
    try {
      axios.put('/posts/' + post._id + '/like', { userId: currentUser._id })
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1)
    setIsLiked(!isLiked)
  }

  const deleteHandler = async () => {
    try {
      await axios.delete('/posts/' + post._id + '/' + currentUser._id)
      fetchPosts()
    } catch (err) {}
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <span onClick={deleteHandler}>Delete</span>
      </Menu.Item>
    </Menu>
  )

  return (
    <div className='post'>
      <div className='postWrapper'>
        <div className='postTop'>
          <div className='postTopLeft'>
            <Link to={`/profile/${user.username}`}>
              <img
                className='postProfileImg'
                src={
                  user.profilePicture
                    ? user.profilePicture
                    : 'https://d225jocw4xhwve.cloudfront.net/person/noAvatar.png'
                }
                alt=''
              />
            </Link>
            <span
              className='postUsername'
              onClick={() => history.push(`/profile/${user.username}`)}
            >
              {user.username}
            </span>
            <span className='postDate'>{format(post.createdAt)}</span>
          </div>
          {post?.userId === currentUser?._id && (
            <div className='postTopRight' style={{ cursor: 'pointer' }}>
              <Dropdown overlay={menu}>
                <MoreVert />
              </Dropdown>
            </div>
          )}
        </div>
        <div className='postCenter'>
          <span className='postText'>{post?.desc}</span>
          {post.img && <img className='postImg' src={post.img} alt='' />}
        </div>
        <div className='postBottom'>
          <div className='postBottomLeft'>
            <img
              className='likeIcon'
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=''
            />
            {/* <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            /> */}
            <span className='postLikeCounter'>{like} people like it</span>
          </div>
          {/* <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div> */}
        </div>
      </div>
    </div>
  )
}
