import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import Register from './pages/register/Register'
import Messenger from './pages/messenger/Messenger'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useSocket from './utils/socket'
import { setOnlineUsers } from './store/actions/socketActions'
import Floating from './components/floatingMessage/Floating'
import { Notifications } from 'react-push-notification'

function App() {
  const dispatch = useDispatch()
  const { theme, user: userRedux } = useSelector((state) => state)
  const { user } = userRedux
  const { socket } = useSocket()

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('darkTheme')
      document.body.classList.remove('lightTheme')
    } else {
      document.body.classList.remove('darkTheme')
      document.body.classList.add('lightTheme')
    }
  }, [theme])

  useEffect(() => {
    if (socket && socket.current) {
      socket.current.on('getUsers', (users) => {
        console.log({ users })
        dispatch(
          setOnlineUsers(
            user?.followings.filter((el) => users.some((u) => u.userId === el))
          )
        )
      })
    }
  }, [user, dispatch, socket])

  return (
    <Router>
      <Notifications />
      <Switch>
        <Route exact path='/'>
          {user ? <Home /> : <Register />}
        </Route>
        <Route path='/login'>{user ? <Redirect to='/' /> : <Login />}</Route>
        <Route path='/register'>
          {user ? <Redirect to='/' /> : <Register />}
        </Route>
        <Route path='/messenger'>
          {!user ? <Redirect to='/' /> : <Messenger />}
        </Route>
        <Route path='/profile/:username'>
          {!user ? <Redirect to='/' /> : <Profile />}
        </Route>
      </Switch>
      {user && <Floating />}
    </Router>
  )
}

export default App
