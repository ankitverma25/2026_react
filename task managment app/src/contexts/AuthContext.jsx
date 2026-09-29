import { useCallback, useEffect, useState } from 'react'
import AuthContext from './authContext.js'
import api from '../lib/api.js'

export function AuthProvider({ children }) {
  // Yahan useState isliye use kiya hai kyunki user, JWT token aur initial session-check state auth changes ke saath UI ko re-render karte hain.
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('task-user') || 'null'))
  const [token, setToken] = useState(() => localStorage.getItem('task-token'))
  const [checkingAuth, setCheckingAuth] = useState(true)
  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('task-user')
    localStorage.removeItem('task-token')
  }, [])

  // Yahan useEffect isliye use kiya hai kyunki app mount hote hi saved token se /auth/me verify karke protected route ka decision lena hai.
  useEffect(() => {
    let active = true
    const checkSession = async () => {
      if (!token) {
        setCheckingAuth(false)
        return
      }
      try {
        const response = await api.get('/auth/me')
        if (active) {
          setUser(response.data.user)
          localStorage.setItem('task-user', JSON.stringify(response.data.user))
        }
      } catch {
        if (active && token !== 'demo-token') logout()
      } finally {
        if (active) setCheckingAuth(false)
      }
    }
    checkSession()
    const onExpired = () => logout()
    window.addEventListener('auth:expired', onExpired)
    return () => {
      active = false
      window.removeEventListener('auth:expired', onExpired)
    }
  }, [token, logout])

  const saveSession = (nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
    localStorage.setItem('task-user', JSON.stringify(nextUser))
    localStorage.setItem('task-token', nextToken)
  }
  return (
    <AuthContext.Provider value={{ user, token, checkingAuth, saveSession, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

