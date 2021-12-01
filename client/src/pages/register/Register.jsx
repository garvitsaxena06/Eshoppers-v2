import { useRef, useContext } from 'react'
import './register.css'
import { useHistory } from 'react-router'
import { CircularProgress } from '@material-ui/core'
import { GenerateKeys } from '../../utils/crypto'
import { message } from 'antd'
import { RegisterCall } from '../../apiCalls'
import { AuthContext } from '../../context/Auth'

export default function Register() {
  const username = useRef()
  const email = useRef()
  const password = useRef()
  const passwordAgain = useRef()
  const history = useHistory()
  const { dispatch, isFetching } = useContext(AuthContext)

  const handleClick = async (e) => {
    e.preventDefault()
    if (passwordAgain.current.value !== password.current.value) {
      message.warning("Passwords don't match!")
    } else {
      const keys = await GenerateKeys()
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
        ...keys,
      }
      RegisterCall(user, dispatch)
        .then((res) => {
          message.success(
            'Registration done successfully. Please login to continue.'
          )
          history.push('/login')
        })
        .catch((err) => {
          console.log(err)
          message.error(err?.response?.data || 'Something went wrong!')
        })
    }
  }

  return (
    <div className='login'>
      <div className='loginWrapper row align-items-center'>
        <div className='loginLeft col-md-6'>
          <h3 className='loginLogo'>Lamasocial</h3>
          <span className='loginDesc'>
            Connect with friends and the world around you on Lamasocial.
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
            <button className='loginButton' type='submit' disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color='white' size='20px' />
              ) : (
                'Sign Up'
              )}
            </button>
            <button
              className='loginRegisterButton'
              onClick={() => history.push('/login')}
              disabled={isFetching}
            >
              {isFetching ? (
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
