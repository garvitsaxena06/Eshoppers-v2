import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_RESET,
  ORDER_PAY_FAIL,
  ORDER_MY_LIST_REQUEST,
  ORDER_MY_LIST_SUCCESS,
  ORDER_MY_LIST_FAIL,
  ORDER_DETAILS_RESET,
  ORDER_MY_LIST_RESET,
  ORDER_CREATE_RESET,
} from '../constants/orderConstants'

export const createOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return { loading: true }
    case ORDER_CREATE_SUCCESS:
      return { loading: false, success: true, order: action.payload }
    case ORDER_CREATE_FAIL:
      return { loading: false, error: action.payload }
    case ORDER_CREATE_RESET:
      return { loading: false, success: false, order: {} }
    default:
      return state
  }
}

export const orderDetailsReducer = (
  state = { loading: true, order: { orderItems: [], shippingAddress: {} } },
  action
) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return { ...state, loading: true }
    case ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload }
    case ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case ORDER_DETAILS_RESET:
      return { order: { orderItems: [], shippingAddress: {} } }
    default:
      return state
  }
}

export const orderPayReducer = (
  state = { loading: false, success: false, order: {} },
  action
) => {
  switch (action.type) {
    case ORDER_PAY_REQUEST:
      return { loading: true, success: false, order: {} }
    case ORDER_PAY_SUCCESS:
      return { loading: false, success: true, order: action.payload }
    case ORDER_PAY_FAIL:
      return { loading: false, error: action.payload, order: {} }
    case ORDER_PAY_RESET:
      return { ...state }
    default:
      return state
  }
}

export const orderListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_MY_LIST_REQUEST:
      return { loading: true, orders: [] }
    case ORDER_MY_LIST_SUCCESS:
      return { loading: false, orders: action.payload }
    case ORDER_MY_LIST_FAIL:
      return { loading: false, error: action.payload, orders: [] }
    case ORDER_MY_LIST_RESET:
      return { orders: [] }
    default:
      return state
  }
}
