import './post.css'
import { MoreVert } from '@material-ui/icons'
import { useContext, useEffect, useState } from 'react'
import { format } from 'timeago.js'
import { Link, useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/Auth'
import { Menu, Dropdown, message } from 'antd'
import { getUserById, likePost, deletePost } from '../../apiCalls'

export default function Post({
  post,
  fetchPosts,
  differentUser = false,
  index,
}) {
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
      getUserById(post.userId)
        .then((res) => {
          setUser(res.data)
        })
        .catch((err) => console.log(err))
    }
    fetchUser()
  }, [post.userId])

  const likeHandler = () => {
    try {
      likePost({ _id: post._id, payload: { userId: currentUser._id } })
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1)
    setIsLiked(!isLiked)
  }

  const deleteHandler = async () => {
    deletePost({ _id: post._id })
      .then((res) => {
        message.success('Post deleted successfully.')
        fetchPosts()
      })
      .catch((err) => {
        message.error('Something went wrong!')
      })
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <span onClick={deleteHandler}>Delete</span>
      </Menu.Item>
    </Menu>
  )

  return (
    <div className={`post ${differentUser && index === 0 ? 'firstPost' : ''}`}>
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
