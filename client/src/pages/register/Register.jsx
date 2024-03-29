import { useRef, useState } from 'react'
import './register.css'
import { useHistory } from 'react-router'
import { CircularProgress } from '@material-ui/core'
import { GenerateKeys } from '../../utils/crypto'
import { message, Radio } from 'antd'
import { RegisterCall } from '../../apiCalls'
import { useDispatch } from 'react-redux'

export default function Register() {
  const username = useRef()
  const email = useRef()
  const password = useRef()
  const passwordAgain = useRef()
  const [userType, setUserType] = useState('Customer')
  const history = useHistory()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const handleClick = async (e) => {
    setLoading(true)
    e.preventDefault()
    if (passwordAgain.current.value !== password.current.value) {
      message.warning("Passwords don't match!")
      setLoading(false)
    } else {
      const keys = await GenerateKeys()
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
        isVendor: userType === 'Vendor',
        ...keys,
      }
      RegisterCall(user, dispatch)
        .then((res) => {
          message.success(
            'Registration done successfully. Please login to continue.'
          )
          setLoading(false)
          history.push('/login')
        })
        .catch((err) => {
          console.log({ err })
          setLoading(false)
          message.error(err?.response?.data?.message || 'Something went wrong!')
        })
    }
  }

  const onChange = (e) => {
    setUserType(e.target.value)
  }

  return (
    <div className='login'>
      <div className='loginWrapper row align-items-center'>
        <div className='loginLeft col-md-6'>
          <h3 className='loginLogo'>EShoppers</h3>
          <span className='loginDesc'>
            The next generation of e-commerce platform that you can trust
          </span>
        </div>
        <div className='loginRight col-md-6'>
          <form className='loginBox' onSubmit={handleClick}>
            <input
              placeholder='Username'
              required
              ref={username}
              name='username'
              className='loginInput'
            />
            <input
              placeholder='Email'
              required
              ref={email}
              name='email'
              className='loginInput'
              type='email'
            />
            <input
              placeholder='Password'
              required
              ref={password}
              name='password'
              className='loginInput'
              type='password'
              minLength='6'
            />
            <input
              placeholder='Confirm Password'
              required
              ref={passwordAgain}
              name='passwordAgain'
              className='loginInput'
              type='password'
            />
            <Radio.Group onChange={onChange} value={userType}>
              <Radio value={'Customer'}>Customer</Radio>
              <Radio value={'Vendor'}>Vendor</Radio>
            </Radio.Group>
            <button className='loginButton' type='submit' disabled={loading}>
              {loading ? (
                <CircularProgress color='white' size='20px' />
              ) : (
                'Sign Up'
              )}
            </button>
            <button
              className='loginRegisterButton'
              onClick={() => history.push('/login')}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress color='white' size='20px' />
              ) : (
                'Log into Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
