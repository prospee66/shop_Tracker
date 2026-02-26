import { createContext, useContext, useReducer } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':  return { currentUser: action.payload, isLoggedIn: true  }
    case 'LOGOUT': return { currentUser: null,           isLoggedIn: false }
    default:       return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    currentUser: authService.getSession(),
    isLoggedIn:  !!authService.getSession(),
  })

  const login = (username, password) => {
    const result = authService.login(username, password)
    if (result.ok) dispatch({ type: 'LOGIN', payload: result.user })
    return result
  }

  const logout = () => {
    authService.logout()
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
