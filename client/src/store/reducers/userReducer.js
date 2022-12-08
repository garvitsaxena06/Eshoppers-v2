import {
  FOLLOW,
  LOGIN_FAILURE,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGOUT,
  UNFOLLOW,
  UPDATE,
} from '../constants/userConstants'

export const userReducer = (
  state = {
    user: null,
    isFetching: false,
    error: false,
  },
  action
) => {
  switch (action.type) {
    case LOGIN_START:
      return {
        user: null,
        isFetching: true,
        error: false,
      }
    case LOGIN_SUCCESS:
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      }
    case LOGIN_FAILURE:
      return {
        user: null,
        isFetching: false,
        error: true,
      }
    case FOLLOW:
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload],
        },
      }
    case UNFOLLOW:
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (following) => following !== action.payload
          ),
        },
      }
    case UPDATE:
      return {
        ...state,
        user: action.payload,
      }
    case LOGOUT:
      return {
        user: null,
        isFetching: false,
        error: false,
      }
    default:
      return state
  }
}
