import { useContext, useEffect, useState } from 'react'
import Post from '../post/Post'
import Share from '../share/Share'
import './feed.css'
import axios from 'axios'
import { AuthContext } from '../../context/Auth'
import { POSTS_BASE_URL } from '../../utils/connections'
export default function Feed({ username }) {
  const [posts, setPosts] = useState([])
  const { user } = useContext(AuthContext)

  const fetchPosts = async () => {
    const res = username
      ? await axios.get(`${POSTS_BASE_URL}/profile/` + username)
      : await axios.get(`${POSTS_BASE_URL}/timeline/` + user._id)
    setPosts(
      res.data.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt)
      }),
    )
  }

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line
  }, [username, user._id])

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && (
          <Share fetchPosts={fetchPosts} />
        )}

        {posts.map((p) => (
          <Post fetchPosts={fetchPosts} key={p._id} post={p} />
        ))}
      </div>
    </div>
  )
}
