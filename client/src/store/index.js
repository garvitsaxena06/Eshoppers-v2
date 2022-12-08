import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { themeReducer } from './reducers/themeReducer'
import { socketReducer } from './reducers/socketReducer'
import { userReducer } from './reducers/userReducer'
import { composeWithDevTools } from 'redux-devtools-extension'

const reducer = combineReducers({
  theme: themeReducer,
  socket: socketReducer,
  user: userReducer,
})

const themeFromStorage = localStorage.getItem('theme')
  ? localStorage.getItem('theme')
  : 'light'
const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : {
      user: null,
      isFetching: false,
      error: false,
    }

const initialState = {
  theme: themeFromStorage,
  user: userFromStorage,
}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
