import { CHANGE_THEME } from '../constants/themeConstants'

export const themeReducer = (state = { theme: 'light' }, action) => {
  switch (action.type) {
    case CHANGE_THEME:
      return action.payload
    default:
      return state
  }
}
