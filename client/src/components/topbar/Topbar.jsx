import './topbar.css'
import {
  Search,
  //Person,
  Chat,
  Home,
  Timeline,
  Message,
  ExitToApp,
} from '@material-ui/icons'
import MenuIcon from '@material-ui/icons/Menu'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import { Link, useHistory } from 'react-router-dom'
import { Menu, Dropdown, message, Drawer, Divider, Switch, Tooltip } from 'antd'
import React, { useContext, useState, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import { AuthContext } from '../../context/Auth'
import { ThemeContext } from '../../context/Theme'
import { changeTheme } from '../../context/Theme/ThemeActions'
import { getFriends, searchUserByUsername } from '../../apiCalls'
import useWindowSize from '../../utils/windowSize'
import { SocketContext } from '../../context/Socket'
import Online from '../online/Online'
import useSocket from '../../utils/socket'

export default function Topbar() {
  const { user, dispatch } = useContext(AuthContext)
  const { onlineUsers } = useContext(SocketContext)
  const { socket } = useSocket()
  const { theme, dispatch: themeDispatch } = useContext(ThemeContext)
  const history = useHistory()
  const [searchedItems, setSearchedItems] = useState([])
  const [visible, setVisible] = useState(false)
  const [friends, setFriends] = useState([])
  const [onlineFriends, setOnlineFriends] = useState([])
  const [loadingFriends, setLoadingFriends] = useState(true)
  const width = useWindowSize()

  useEffect(() => {
    setLoadingFriends(true)
    getFriends(user._id)
      .then((res) => {
        setFriends(res.data)
        setLoadingFriends(false)
      })
      .catch((err) => {
        console.log(err)
        setLoadingFriends(false)
      })
  }, [user._id])

  useEffect(() => {
    setOnlineFriends(friends.filter((el) => onlineUsers?.includes(el._id)))
  }, [onlineUsers, friends])

  const handleSearch = (e) => {
    const { value } = e.target
    if (value) {
      searchUserByUsername(value)
        .then((res) => {
          setSearchedItems(res.data)
        })
        .catch((err) => {
          console.log(err)
          setSearchedItems([])
        })
    } else {
      setSearchedItems([])
    }
  }

  const showHandler = () => {
    setVisible(true)
  }

  const closeHandler = () => {
    setVisible(false)
  }

  const logoutHandler = () => {
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    socket.current.emit('logoutUser', user._id)
    message.success('Logout successfully.')
    history.push('/')
  }

  const menu = (
    <Menu>
      <Menu.Item key='Profile'>
        <Link to={`/profile/${user.username}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key='Logout'>
        <div onClick={logoutHandler}>Logout</div>
      </Menu.Item>
    </Menu>
  )

  const checkUserOnline = (id) => {
    return onlineFriends.some((el) => el._id === id)
  }

  return (
    <div className='topbarContainer'>
      <div className='topbarLeft'>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <span className='logo'>ViaChat</span>
        </Link>
      </div>
      <div className='topbarCenter'>
        <div className='searchbar'>
          <Search className='searchIcon' />
          <Autocomplete
            freeSolo
            id='free-solo-2-demo'
            options={searchedItems}
            PaperComponent={({ children }) => (
              <Paper
                style={
                  theme === 'dark'
                    ? {
                        background: '#0a0c0e',
                        border: '1px solid #181111',
                      }
                    : {}
                }
              >
                {children}
              </Paper>
            )}
            getOptionLabel={(option) => option.username}
            renderOption={(option) => (
              <div
                className='searchSuggestions'
                onClick={() => history.push(`/profile/${option.username}`)}
              >
                <div className='profilePicture'>
                  <img
                    src={
                      option.profilePicture
                        ? option.profilePicture
                        : 'https://d225jocw4xhwve.cloudfront.net/person/noAvatar.png'
                    }
                    alt=''
                    className='topbarImg'
                  />
                </div>
                <div className='searchContent'>
                  <div className='email'>{option.email}</div>
                  <div className='username'>{option.username}</div>
                </div>
              </div>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  width > 340
                    ? `Search for friend (by username)`
                    : `Search for friend`
                }
                margin='normal'
                onChange={(e) => handleSearch(e)}
                InputProps={{ ...params.InputProps, type: 'search' }}
              />
            )}
          />
        </div>
      </div>
      <div className='topbarRight'>
        <div className='topbarLinks'>
          <span className='topbarLink' onClick={() => history.push('/')}>
            Homepage
          </span>
          <span
            className='topbarLink'
            onClick={() => history.push(`/profile/${user.username}`)}
          >
            Timeline
          </span>
        </div>

        <div className='d-flex align-items-center'>
          <div className='topbarIcons'>
            {/* <div className="topbarIconItem">
              <Person />
              <span className="topbarIconBadge">1</span>
            </div> */}
            <div
              className='topbarIconItem'
              onClick={() => history.push('/messenger')}
            >
              <Chat />
              {/* <span className="topbarIconBadge">2</span> */}
            </div>
            <div className='topbarIconItem'>
              <Tooltip
                overlayStyle={{ whiteSpace: 'pre-line', fontSize: 13 }}
                title={`Dark theme`}
                placement='bottom'
              >
                <Switch
                  size='small'
                  checked={theme === 'dark' ? true : false}
                  onChange={(checked) => {
                    themeDispatch(changeTheme(checked ? 'dark' : 'light'))
                    localStorage.setItem('theme', checked ? 'dark' : 'light')
                  }}
                />
              </Tooltip>

              {/* <span className="topbarIconBadge">1</span> */}
            </div>
          </div>
          <span className='helloUserText'>Hello, {user?.username}</span>
          <Dropdown overlay={menu}>
            <img
              src={
                user.profilePicture
                  ? user.profilePicture
                  : 'https://d225jocw4xhwve.cloudfront.net/person/noAvatar.png'
              }
              alt=''
              className='topbarImg'
            />
          </Dropdown>
        </div>
      </div>
      <div className='menuIcon'>
        <IconButton onClick={showHandler}>
          <MenuIcon style={{ color: '#fff' }} />
        </IconButton>
      </div>
      <Drawer
        width={width > 370 ? 320 : '100%'}
        placement='right'
        visible={visible}
        onClose={closeHandler}
      >
        <div className='profileContainer'>
          <img
            src={
              user.profilePicture
                ? user.profilePicture
                : 'https://d225jocw4xhwve.cloudfront.net/person/noAvatar.png'
            }
            style={{ width: 80, height: 80 }}
            alt=''
            className='topbarImg'
          />
          <div className='profileContent ms-2'>
            <h5 className='profileUsername'>
              Hello, <br /> <strong>@{user.username}</strong>
            </h5>
            <Link to={`/profile/${user.username}`}>Visit your profile</Link>
          </div>
        </div>
        <Divider />
        <div className='profileLinks'>
          <div className='profileLink'>
            <Home />
            <span onClick={() => history.push(`/`)}>Homepage</span>
          </div>
          <div className='profileLink'>
            <Timeline />
            <span onClick={() => history.push(`/profile/${user.username}`)}>
              Timeline
            </span>
          </div>
          <div className='profileLink'>
            <Message />
            <span onClick={() => history.push(`/messenger`)}>Messenger</span>
          </div>
          <div className='profileLink'>
            <ExitToApp />
            <span onClick={logoutHandler}>Logout</span>
          </div>
          <Divider />
          <div className='profileLink mt-2'>
            <Switch
              checked={theme === 'dark' ? true : false}
              onChange={(checked) => {
                themeDispatch(changeTheme(checked ? 'dark' : 'light'))
                localStorage.setItem('theme', checked ? 'dark' : 'light')
              }}
            />
            Toggle theme
          </div>
        </div>
        <Divider />
        <h5 className='profileUsername mb-3'>Your friends</h5>
        {!loadingFriends
          ? friends.map((u) => {
              const online = checkUserOnline(u._id)
              return (
                <div
                  key={u._id}
                  onClick={() => {
                    closeHandler()
                    history.push(`/messenger?q=${u._id}`)
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <Online key={u._id} user={u} online={online} />
                </div>
              )
            })
          : [...Array(2).keys()].map((el, i) => (
              <div key={i} className='d-flex align-items-center pe-3 py-2'>
                <div>
                  <Skeleton circle width={40} height={40} />
                </div>
                <div className='w-100 ps-3'>
                  <Skeleton count={3} />
                </div>
              </div>
            ))}
      </Drawer>
    </div>
  )
}
