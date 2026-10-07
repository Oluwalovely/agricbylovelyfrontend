import axios from 'axios'
import { accessToken, refreshToken, sessionVersion, clearSession } from './session.js'

const baseURL = import.meta.env?.VITE_API_URL || 'http://localhost:8001/api'
const publicAuth = /\/auth\/(login|register|forgot-password|reset-password|refresh)$/
const api = axios.create({ baseURL, timeout: 60000, headers: { 'Content-Type': 'application/json' } })
const refreshClient = axios.create({ baseURL, timeout: 60000 })
let refreshRequest = null

export const refreshAccessToken = () => {
  const version = sessionVersion()
  if (refreshRequest?.version === version) return refreshRequest.promise
  const token = refreshToken()
  if (!token) {
    clearSession()
    return Promise.reject(new Error('Please sign in again'))
  }

  const promise = refreshClient.post('/auth/refresh', { refreshToken: token })
    .then(({ data }) => {
      if (version !== sessionVersion()) throw new axios.CanceledError('Account changed')
      if (typeof data.accessToken !== 'string' || !data.accessToken) {
        throw new Error('Invalid token response')
      }
      localStorage.setItem('accessToken', data.accessToken)
      return data.accessToken
    })
    .catch(error => {
      if (version === sessionVersion() && [400, 401].includes(error.response?.status)) {
        clearSession()
      }
      throw error
    })
    .finally(() => {
      if (refreshRequest?.version === version) refreshRequest = null
    })
  refreshRequest = { version, promise }
  return promise
}

api.interceptors.request.use(config => {
  if (config._sessionVersion !== undefined && config._sessionVersion !== sessionVersion()) {
    throw new axios.CanceledError('Account changed')
  }
  config._sessionVersion = sessionVersion()
  if (!config.skipAuth && !publicAuth.test(config.url)) {
    const token = accessToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => {
    if (response.config._sessionVersion !== sessionVersion()) {
      throw new axios.CanceledError('Account changed')
    }
    return response
  },
  async error => {
    const original = error.config
    if (!original || original.skipRefresh || publicAuth.test(original.url)) return Promise.reject(error)
    if (original._sessionVersion !== sessionVersion()) {
      throw new axios.CanceledError('Account changed')
    }
    if (error.response?.status !== 401) return Promise.reject(error)
    if (original._retry) {
      clearSession()
      return Promise.reject(error)
    }

    original._retry = true
    const token = await refreshAccessToken()
    original.headers.Authorization = `Bearer ${token}`
    return api(original)
  }
)

export const apiErrorMessage = (error, fallback) =>
  error.response?.data?.errors?.map(issue => issue.message).join(' ') ||
  error.response?.data?.message || fallback

export default api
