import { useContext } from 'react'
import AuthContext from '../contexts/authContext.js'

// Yahan useContext isliye use kiya hai kyunki login, route guard, aur dashboard ko auth state chahiye bina props ko har layout layer se pass kiye.
export default function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}