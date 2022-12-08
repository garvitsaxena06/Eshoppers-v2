import './share.css'
import {
  PermMedia,
  // Label,
  // Room,
  // EmojiEmotions,
  Cancel,
} from '@material-ui/icons'
import { useRef, useState } from 'react'
import axios from 'axios'
import { message } from 'antd'
import { upload } from '../../utils/upload'
import { POSTS_BASE_URL } from '../../utils/connections'
import { useSelector } from 'react-redux'

export default function Share({ fetchPosts }) {
  const { user } = useSelector((state) => state.user)
  const desc = useRef()
  const imageRef = useRef()
  const [file, setFile] = useState(null)

  const uploadPost = (payload) => {
    axios
      .post(POSTS_BASE_URL, payload)
      .then((res) => {
        message.success('New Post Uploaded')
        fetchPosts()
      })
      .catch((err) => {
        message.error(err?.data || 'Please try again later.')
      })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    let payload = {
      userId: user._id,
      desc: desc.current.value,
    }
    if (file) {
      try {
        upload(file, (err, response) => {
          if (!err) {
            payload.img = response
            uploadPost(payload)
          } else {
            message.error(err?.message || 'Please try again later.')
          }
        })
      } catch (err) {}
    } else {
      if (desc.current.value.length > 0) {
        uploadPost(payload)
      } else {
        message.warning("You can't upload a blank post.")
      }
    }
    desc.current.value = ''
    setFile(null)
  }

  return (
    <div className='share'>
      <div className='shareWrapper'>
        <div className='shareTop'>
          <img
            className='shareProfileImg'
            src={
              user.profilePicture
                ? user.profilePicture
                : 'https://d225jocw4xhwve.cloudfront.net/person/noAvatar.png'
            }
            alt=''
          />
          <textarea
            placeholder={"What's in your mind " + user.username + '?'}
            className='shareInput'
            ref={desc}
          />
        </div>
        <hr className='shareHr' />
        {file && (
          <div className='shareImgContainer'>
            <img className='shareImg' src={URL.createObjectURL(file)} alt='' />
            <Cancel
              className='shareCancelImg'
              onClick={() => {
                setFile(null)
                imageRef.current.value = null
              }}
            />
          </div>
        )}
        <form className='shareBottom' onSubmit={submitHandler}>
          <div className='shareOptions'>
            <label htmlFor='feedPost' className='shareOption'>
              <PermMedia htmlColor='tomato' className='shareIcon' />
              <span className='shareOptionText'>Photo or Video</span>
              <input
                style={{ display: 'none' }}
                type='file'
                ref={imageRef}
                id='feedPost'
                accept='.png,.jpeg,.jpg'
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            {/* <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div> */}
          </div>
          <button className='shareButton' type='submit'>
            Share
          </button>
        </form>
      </div>
    </div>
  )
}
