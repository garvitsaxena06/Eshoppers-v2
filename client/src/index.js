import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'
import { AuthContextProvider } from './context/Auth'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'antd/dist/antd.css'
import 'react-loading-skeleton/dist/skeleton.css'
import './style.scss'

ReactDOM.render(
  <Provider store={store}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </Provider>,
  document.getElementById('root')
)
