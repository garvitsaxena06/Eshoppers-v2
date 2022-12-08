import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { themeReducer } from './reducers/themeReducer'
import { composeWithDevTools } from 'redux-devtools-extension'

const reducer = combineReducers({
  theme: themeReducer,
})

const themeFromStorage = localStorage.getItem('theme')
  ? localStorage.getItem('theme')
  : 'light'

const initialState = {
  theme: themeFromStorage,
}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
