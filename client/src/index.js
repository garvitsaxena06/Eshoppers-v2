import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { AuthContextProvider } from './context/Auth'
import { SocketProvider } from './context/Socket'
import { ThemeContextProvider } from './context/Theme'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'antd/dist/antd.css'
import 'react-loading-skeleton/dist/skeleton.css'
import './style.scss'

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SocketProvider>
        <ThemeContextProvider>
          <App />
        </ThemeContextProvider>
      </SocketProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
