import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/authStore.js'
import useThemeStore from './store/themeStore.js'

// Pages
import Landing    from './pages/Landing.jsx'
import Login      from './pages/Login.jsx'
import Register   from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword  from './pages/ResetPassword.jsx'
import Dashboard  from './pages/Dashboard.jsx'
import Crops      from './pages/Crops.jsx'
import MyCrops    from './pages/MyCrops.jsx'
import Fields     from './pages/Fields.jsx'
import Weather    from './pages/Weather.jsx'
import Calendar   from './pages/Calendar.jsx'
import Notifications from './pages/Notifications.jsx'
import Reports    from './pages/Reports.jsx'
import Profile    from './pages/Profile.jsx'

// Layout
import AppLayout      from './components/layout/AppLayout.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'

const App = () => {
  const { checkAuth } = useAuthStore()
  const { initTheme } = useThemeStore()

  useEffect(() => {
    checkAuth()  // check if tokens exist in localStorage
    initTheme()  // apply saved theme preference
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"                element={<Landing />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />

        {/* Protected routes — require login */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard"     element={<Dashboard />} />
            <Route path="/crops"         element={<Crops />} />
            <Route path="/my-crops"      element={<MyCrops />} />
            <Route path="/fields"        element={<Fields />} />
            <Route path="/weather"       element={<Weather />} />
            <Route path="/calendar"      element={<Calendar />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reports"       element={<Reports />} />
            <Route path="/profile"       element={<Profile />} />
          </Route>
        </Route>

        {/* Catch all — redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App