import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'
import Button from '../ui/Button.jsx'

const ProtectedRoute = () => {
  const { isLoggedIn, isInitializing, sessionError, checkAuth, clearAuth } = useAuthStore()
  const location = useLocation()

  if (isInitializing) {
    return <div role="status" className="min-h-screen flex items-center justify-center">Loading your farm account?</div>
  }
  if (sessionError) {
    return (
      <div role="alert" className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <p>{sessionError}</p>
        <Button onClick={() => checkAuth({ force: true })}>Try again</Button>
        <Button variant="ghost" onClick={clearAuth}>Back to sign in</Button>
      </div>
    )
  }
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location }} replace />
  return <Outlet />
}

export default ProtectedRoute
