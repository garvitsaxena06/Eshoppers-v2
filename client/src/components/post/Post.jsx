import './post.css'
import { MoreVert } from '@material-ui/icons'
import { useContext, useEffect, useState } from 'react'
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/Auth'
import { Menu, Dropdown } from 'antd'
import { getUserById, likePost, deletePost } from '../../apiCalls'

export default function Post({ post, fetchPosts }) {
  const [like, setLike] = useState(post.likes.length)
  const [isLiked, setIsLiked] = useState(false)
  const [user, setUser] = useState({})
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const { user: currentUser } = useContext(AuthContext)

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id))
  }, [currentUser._id, post.likes])

  useEffect(() => {
    const fetchUser = async () => {
      getUserById(post.userId)
        .then((res) => {
          console.log({ res })
          setUser(res.data)
        })
        .catch(console.log)
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
    try {
      deletePost({ _id: post._id })
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
                    : PF + 'person/noAvatar.png'
                }
                alt=''
              />
            </Link>
            <span className='postUsername'>{user.username}</span>
            <span className='postDate'>{format(post.createdAt)}</span>
          </div>
          <div className='postTopRight'>
            <Dropdown overlay={menu}>
              <MoreVert />
            </Dropdown>
          </div>
        </div>
        <div className='postCenter'>
          <span className='postText'>{post?.desc}</span>
          <img className='postImg' src={post.img} alt='' />
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
