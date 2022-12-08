import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Skeleton from 'react-loading-skeleton'
import Post from '../post/Post'
import Share from '../share/Share'
import './feed.css'
import axios from 'axios'
import { POSTS_BASE_URL } from '../../utils/connections'

export default function Feed({ username, user: userProps }) {
  const { user } = useSelector((state) => state.user)
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  const fetchPosts = async () => {
    setLoadingPosts(true)
    try {
      const res = username
        ? await axios.get(`${POSTS_BASE_URL}/profile/` + username)
        : await axios.get(`${POSTS_BASE_URL}/timeline/` + user._id)
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt)
        })
      )
      setLoadingPosts(false)
    } catch (error) {
      setLoadingPosts(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line
  }, [username, user._id, userProps])

  return (
    <div className='feed'>
      <div className='feedWrapper'>
        {(!username || username === user.username) && (
          <Share fetchPosts={fetchPosts} />
        )}

        {!loadingPosts ? (
          posts && posts.length > 0 ? (
            posts.map((p, i) => (
              <Post
                fetchPosts={fetchPosts}
                key={p._id}
                post={p}
                index={i}
                differentUser={userProps ? userProps?._id !== user._id : false}
              />
            ))
          ) : (
            <h3 className='noPostHeading'>
              {userProps
                ? userProps?._id !== user._id
                  ? '@' + userProps?.username
                  : 'You'
                : 'You'}{' '}
              have not post anything yet!
            </h3>
          )
        ) : (
          [...Array(2).keys()].map((el, i) => (
            <div key={i} className='mt-3'>
              <div className='d-flex align-items-center pe-3 py-2'>
                <div>
                  <Skeleton circle width={40} height={40} />
                </div>
                <div className='ps-3'>
                  <Skeleton count={2} width={200} />
                </div>
                <div className='w-100 ps-3'>
                  <Skeleton width={100} />
                </div>
              </div>
              <Skeleton count={2} />
              <Skeleton height={180} />
              <div className='d-flex align-items-center pe-3 py-2'>
                <div>
                  <Skeleton circle width={40} height={40} />
                </div>
                <div className='ps-3'>
                  <Skeleton width={200} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
