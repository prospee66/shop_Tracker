import { Navigate } from 'react-router-dom'
import { useAuth  } from '../../context/AuthContext'

/**
 * Renders `children` only if the user is logged in (and optionally has the required role).
 * Otherwise redirects to /login.
 */
export default function ProtectedRoute({ children, role }) {
  const { currentUser, isLoggedIn } = useAuth()

  if (!isLoggedIn || !currentUser) return <Navigate to="/login" replace />

  if (role && currentUser.role !== role) {
    const fallback = currentUser.role === 'admin' ? '/admin/dashboard' : '/sale'
    return <Navigate to={fallback} replace />
  }

  return children
}
