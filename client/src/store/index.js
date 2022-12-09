import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { themeReducer } from './reducers/themeReducer'
import { socketReducer } from './reducers/socketReducer'
import { userReducer } from './reducers/userReducer'
import {
  productListReducer,
  productDetailsReducer,
} from './reducers/productReducer'
import { cartReducer } from './reducers/cartReducer'
import {
  createOrderReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderListReducer,
} from './reducers/orderReducer'
import { composeWithDevTools } from 'redux-devtools-extension'

const reducer = combineReducers({
  theme: themeReducer,
  socket: socketReducer,
  user: userReducer,

  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  orderCreate: createOrderReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderMyList: orderListReducer,
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
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []
const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {}

const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
  ? localStorage.getItem('paymentMethod')
  : ''

const initialState = {
  theme: themeFromStorage,
  user: userFromStorage,
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: paymentMethodFromStorage,
  },
}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
