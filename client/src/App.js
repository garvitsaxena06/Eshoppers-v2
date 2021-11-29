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
import { useContext, useEffect } from 'react'
import useSocket from './utils/socket'
import { AuthContext } from './context/Auth'
import { SocketContext } from './context/Socket'
import { setOnlineUsers } from './context/Socket/SocketActions'
import Floating from './components/floatingMessage/Floating'

function App() {
  const { user } = useContext(AuthContext)
  const { dispatch } = useContext(SocketContext)
  const { socket } = useSocket()

  useEffect(() => {
    if (socket && socket.current) {
      socket.current.on('getUsers', (users) => {
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
          <Profile />
        </Route>
      </Switch>
      {user && <Floating />}
    </Router>
  )
}

export default App
