import React from 'react'
import './floating.css'
import Fab from '@material-ui/core/Fab'
import MessageIcon from '@material-ui/icons/Message'
import { useHistory } from 'react-router'
import useWindowSize from '../../utils/windowSize'

const Floating = () => {
  const history = useHistory()
  const width = useWindowSize()
  return history.location.pathname === '/messenger' && width < 783 ? null : (
    <Fab
      color='primary'
      aria-label='add'
      className='message-ctaBtn'
      onClick={() => history.push('/messenger')}
    >
      <MessageIcon />
    </Fab>
  )
}

export default Floating
