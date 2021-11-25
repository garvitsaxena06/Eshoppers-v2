import './topbar.css'
import {
  Search,
  //Person,
  Chat,
  Notifications,
} from '@material-ui/icons'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import { Link, useHistory } from 'react-router-dom'
import { Menu, Dropdown, message } from 'antd'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/Auth'
import { searchUserByUsername } from '../../apiCalls'

export default function Topbar() {
  const { user, dispatch } = useContext(AuthContext)
  const history = useHistory()
  const [searchedItems, setSearchedItems] = useState([])
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

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

  const logoutHandler = () => {
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    message.success('Logout successfully')
    history.push('/')
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <Link to={`/profile/${user.username}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item>
        <div onClick={logoutHandler}>Logout</div>
      </Menu.Item>
    </Menu>
  )

  return (
    <div className='topbarContainer'>
      <div className='topbarLeft'>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <span className='logo'>Lamasocial</span>
        </Link>
      </div>
      <div className='topbarCenter'>
        <div className='searchbar'>
          <Search className='searchIcon' />
          <Autocomplete
            freeSolo
            id='free-solo-2-demo'
            disableClearable
            options={searchedItems}
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
                        ? PF + option.profilePicture
                        : PF + 'person/noAvatar.png'
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
                label='Search for friend (by username)'
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

        <div className='d-flex'>
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
              <Notifications />
              {/* <span className="topbarIconBadge">1</span> */}
            </div>
          </div>
          <Dropdown overlay={menu}>
            <img
              src={
                user.profilePicture
                  ? PF + user.profilePicture
                  : PF + 'person/noAvatar.png'
              }
              alt=''
              className='topbarImg'
            />
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
