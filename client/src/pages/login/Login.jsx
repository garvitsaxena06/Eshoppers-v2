import { useRef } from 'react'
import './login.css'
import { loginCall } from '../../apiCalls'
import { CircularProgress } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

export default function Login() {
  const history = useHistory()
  const email = useRef()
  const password = useRef()

  const dispatch = useDispatch()
  const { isFetching } = useSelector((state) => state.user)

  const handleClick = (e) => {
    e.preventDefault()
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    )
  }

  return (
    <div className='login'>
      <div className='loginWrapper row align-items-center'>
        <div className='loginLeft col-md-6'>
          <h3 className='loginLogo'>Eshoppers</h3>
          <span className='loginDesc'>
            The next generation of e-commerce platform that you can trust
          </span>
        </div>
        <div className='loginRight col-md-6'>
          <form className='loginBox' onSubmit={handleClick}>
            <input
              placeholder='Email'
              type='email'
              name='email'
              required
              className='loginInput'
              ref={email}
            />
            <input
              placeholder='Password'
              type='password'
              name='password'
              required
              minLength='6'
              className='loginInput'
              ref={password}
            />
            <button className='loginButton' type='submit' disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color='white' size='20px' />
              ) : (
                'Log In'
              )}
            </button>
            {/* <span className='loginForgot'>Forgot Password?</span> */}
            <button
              className='loginRegisterButton'
              onClick={() => history.push('/')}
              disabled={isFetching}
            >
              {isFetching ? (
                <CircularProgress color='white' size='20px' />
              ) : (
                'Create a New Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
