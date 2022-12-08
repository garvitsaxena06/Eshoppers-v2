import { CHANGE_THEME } from '../constants/themeConstants'

export const changeTheme = (theme) => (dispatch) => {
  dispatch({ type: CHANGE_THEME, payload: theme })
  localStorage.setItem('theme', theme)
}
