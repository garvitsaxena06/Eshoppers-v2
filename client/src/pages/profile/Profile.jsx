import './profile.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Rightbar from '../../components/rightbar/Rightbar'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getFriends, updateUser, getUserByUsername } from '../../apiCalls'
import { CameraAlt } from '@material-ui/icons'
import { upload } from '../../utils/upload'
import { message } from 'antd'
import {
  Spinner,
  Row,
  Col,
  ListGroup,
  Form,
  Button,
  Image,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { UPDATE } from '../../store/constants/userConstants'
import { getOrderList } from '../../store/actions/orderActions'
import { Link } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState({})
  const dispatch = useDispatch()
  const { user: loggedInUser } = useSelector((state) => state.user)
  const { orders } = useSelector((state) => state.orderMyList)
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
      getUserByUsername(username)
        .then((res) => {
          setUser(res.data)
        })
        .catch((err) => console.log(err))
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

  useEffect(() => {
    dispatch(getOrderList(loggedInUser._id))
  }, [dispatch, loggedInUser._id])

  const UpdateUserDetails = (state, cb = () => {}) => [
    updateUser({ ...state, userId: user._id })
      .then((res) => {
        cb(false, res)
        setUser(res.data.data)
        dispatch({ type: UPDATE, payload: res.data.data })
        localStorage.setItem('user', JSON.stringify(res.data.data))
        setLoading({ coverPicture: false, profilePicture: false })
        message.success(res?.data?.message || 'Profile updated successfully.')
      })
      .catch((err) => {
        console.log(err)
      }),
  ]

  const handleFileUpload = (file, name) => {
    upload(file, (err, response) => {
      if (!err) {
        setLoading({ ...loading, [name]: true })
        UpdateUserDetails({ ...loggedInUser, [name]: response })
      } else {
        message.error(err?.message || 'Something went wrong!')
      }
    })
  }

  console.log({ orders })

  return (
    <>
      <Topbar />
      <div className='profile'>
        <Sidebar friends={friends} />
        <div className='profileRight'>
          <div className='profileRightTop'>
            <div className='profileCover'>
              <div>
                <img className='profileCoverImg' alt='' />
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
          <Rightbar
            user={user}
            UpdateUserDetails={UpdateUserDetails}
            loadingUserDetails={loadingUserDetails}
            mobileView
          />
          <div className='profileRightBottom'>
            <Row className='h-100 min-vh-50 ms-3 w-100'>
              <Col md={8} className='border-end'>
                <h4 className='fw-bold text-decoration-underline'>My Orders</h4>
                {orders && orders.length === 0 ? (
                  <h6 className=' -bold mt-4'>
                    <span className='me-2'>
                      You've not ordered anything yet!
                    </span>
                    <Link to='/'>
                      <Button className='cta-btn-small'>Keep shopping</Button>
                    </Link>
                  </h6>
                ) : (
                  <>
                    {orders.map((order) => (
                      <ListGroup className='mt-4' variant='flush'>
                        <p className='fs-6 fw-semibold mb-0'>
                          <u className='fw-bold me-2'>Order placed on:</u>
                          {new Date(order.createdAt).toLocaleDateString(
                            'en-GB',
                            {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                          {', '}
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>{' '}
                        <p className='fs-6 fw-semibold mb-0'>
                          <u>Delivery:</u>{' '}
                          {order?.isDelivered ? (
                            <span className='text-success'>Delivered</span>
                          ) : (
                            <span className='text-danger'>
                              Not delivered yet
                            </span>
                          )}
                        </p>
                        <p className='fs-6 fw-semibold mb-0'>
                          <u>Paid:</u> {order?.isPaid ? 'Yes' : 'No'}
                        </p>
                        {order.orderItems.map((item, index) => (
                          <ListGroup.Item className='py-3' key={index}>
                            <Row className='bg-light border py-3 px-4 align-items-center justify-content-between'>
                              <Col md={3}>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fluid
                                  rounded
                                />
                              </Col>
                              <Col md={7}>
                                <Link
                                  to={`/product/${item.product}`}
                                  className='fs-6 fw-bold'
                                >
                                  {item.name}
                                </Link>{' '}
                                <br />
                                <span className='fw-semibold'>
                                  <u>Price:</u> Rs.{' '}
                                  {item.price?.toLocaleString('en-IN')} x{' '}
                                  {item.qty}
                                </span>
                                <br />
                                <br />
                                <span className='fw-semibold'>
                                  <u>Address:</u>{' '}
                                  {order.shippingAddress.address},{' '}
                                  {order.shippingAddress.city}{' '}
                                  {order.shippingAddress.postalCode},{' '}
                                  {order.shippingAddress.country}
                                </span>
                              </Col>
                              <Col md={2}>
                                <Form.Control
                                  as='text'
                                  disabled={true}
                                  value={item.qty}
                                >
                                  <option value={item.qty} key={item.qty}>
                                    {item.qty}
                                  </option>
                                </Form.Control>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        ))}
                        <hr />
                      </ListGroup>
                    ))}
                  </>
                )}
              </Col>
              <Col md={3} className='mt-3'>
                <Rightbar
                  user={user}
                  UpdateUserDetails={UpdateUserDetails}
                  loadingUserDetails={loadingUserDetails}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  )
}
