import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { AuthContextProvider } from './context/Auth'
import { SocketProvider } from './context/Socket'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'antd/dist/antd.css'
import './style.scss'

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
