import api from './api.js'
import { accessToken, clearSession } from './session.js'

const authService = {
  register: data => api.post('/auth/register', data),
  login: data => api.post('/auth/login', data),
  logout: () => {
    const token = accessToken()
    clearSession()
    if (!token) return Promise.resolve()
    return api.post('/auth/logout', {}, {
      skipRefresh: true,
      skipAuth: true,
      headers: { Authorization: `Bearer ${token}` },
    })
  },
  forgotPassword: email => api.post('/auth/forgot-password', { email }),
  resetPassword: data => api.post('/auth/reset-password', data),
}
export default authService
