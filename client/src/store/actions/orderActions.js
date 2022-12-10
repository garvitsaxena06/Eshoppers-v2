import axios from 'axios'
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_RESET,
  ORDER_MY_LIST_REQUEST,
  ORDER_MY_LIST_SUCCESS,
  ORDER_MY_LIST_FAIL,
  ORDER_DETAILS_RESET,
  ORDER_MY_LIST_RESET,
} from '../constants/orderConstants'

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST })

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    }

    const { data } = await axios.post(`${BASE_URL}/api/orders`, order, config)
    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST })

    const { data } = await axios.get(`${BASE_URL}/api/orders/${id}`)
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data.data })
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const orderDetailsReset = () => (dispatch) => {
  dispatch({ type: ORDER_DETAILS_RESET })
}

export const payOrder =
  (orderId, paymentResult) => async (dispatch, getState) => {
    try {
      dispatch({ type: ORDER_PAY_REQUEST })

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      }

      const { data } = await axios.put(
        `${BASE_URL}/api/orders/${orderId}/pay`,
        paymentResult,
        config
      )
      dispatch({ type: ORDER_PAY_SUCCESS, payload: data.data })
    } catch (error) {
      dispatch({
        type: ORDER_PAY_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

export const payOrderReset = () => (dispatch) => {
  dispatch({ type: ORDER_PAY_RESET })
}

export const getOrderList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_MY_LIST_REQUEST })

    const { data } = await axios.get(`${BASE_URL}/api/orders/myorders`)
    dispatch({ type: ORDER_MY_LIST_SUCCESS, payload: data.data })
  } catch (error) {
    dispatch({
      type: ORDER_MY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const orderListReset = () => (dispatch) => {
  dispatch({ type: ORDER_MY_LIST_RESET })
}
