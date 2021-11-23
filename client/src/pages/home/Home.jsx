import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import { AuthContext } from '../../context/AuthContext'
import './home.css'
import { useContext, useEffect } from 'react'
import { useHistory } from 'react-router'

export default function Home() {
  const history = useHistory()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (!user) {
      history.push('/')
    }
    // eslint-disable-next-line
  }, [user])

  return (
    <>
      <Topbar />
      <div className='homeContainer'>
        <Sidebar />
        <Feed />
        <Rightbar />
      </div>
    </>
  )
}
