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
import { useContext, useRef, useEffect} from 'react'
import { io } from 'socket.io-client'
import { AuthContext } from './context/AuthContext'
import Floating from './components/floatingMessage/Floating'

function App() {
  const { user } = useContext(AuthContext)
  const socket = useRef()

  useEffect(() => {
    socket.current = io('ws://localhost:8900')
    socket.current.emit('addUser', user?._id)
    // socket.current.on('getUsers', (users) => {
    //   setOnlineUsers(
    //     user.followings.filter((el) => users.some((u) => u.userId === el))
    //   )
    // })
  }, [user])

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
