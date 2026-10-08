import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore.js'
import Button from '../ui/Button.jsx'
import logoImage from '../../assets/logo.png'

const ProtectedRoute = () => {
  const { isLoggedIn, isInitializing, sessionError, checkAuth, clearAuth } = useAuthStore()
  const location = useLocation()

  if (isInitializing) {
    return (
      <div role="status" className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-secondary)' }}>
        <img src={logoImage} alt="" width={176} height={176} className="account-loading-logo" />
        <span className="sr-only">Loading your farm account.</span>
      </div>
    )
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
