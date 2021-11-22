import React from 'react'
import './floating.css'
import Fab from '@material-ui/core/Fab'
import MessageIcon from '@material-ui/icons/Message'
import { useHistory } from 'react-router'

const Floating = () => {
  const history = useHistory()
  return (
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
