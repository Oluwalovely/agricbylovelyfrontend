import { queryClient } from '../lib/queryClient.js'

let version = 0
const listeners = new Set()

export const sessionVersion = () => version
export const accessToken = () => localStorage.getItem('accessToken')
export const refreshToken = () => localStorage.getItem('refreshToken')
export const subscribeSession = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const resetCache = () => {
  void queryClient.cancelQueries()
  queryClient.clear()
}

export const startSession = (access, refresh) => {
  version++
  resetCache()
  localStorage.setItem('accessToken', access)
  localStorage.setItem('refreshToken', refresh)
}

export const syncExternalSession = () => {
  version++
  resetCache()
  listeners.forEach(listener => listener())
}

export const clearSession = () => {
  version++
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  resetCache()
  listeners.forEach(listener => listener())
}
