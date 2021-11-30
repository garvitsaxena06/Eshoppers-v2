import { createContext, useReducer } from 'react'
import ThemeReducer from './ThemeReducer'

const INITIAL_STATE = {
  theme: localStorage.getItem('theme') || 'light',
}

export const ThemeContext = createContext(INITIAL_STATE)

export const ThemeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ThemeReducer, INITIAL_STATE)

  return (
    <ThemeContext.Provider
      value={{
        theme: state.theme,
        dispatch,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
