import { create } from 'zustand'
import api from '../services/api.js'
import {
  accessToken, refreshToken, sessionVersion, startSession, clearSession, subscribeSession,
} from '../services/session.js'

let initialization = null

const useAuthStore = create((set, get) => ({
  farmer: null,
  isLoggedIn: false,
  isInitializing: true,
  sessionError: null,

  setAuth: (farmer, access, refresh) => {
    startSession(access, refresh)
    set({ farmer, isLoggedIn: true, isInitializing: false, sessionError: null })
  },
  setFarmer: farmer => set({ farmer }),
  clearAuth: clearSession,

  checkAuth: ({ force = false } = {}) => {
    const version = sessionVersion()
    if (initialization?.version === version) return initialization.promise
    if (!force && !get().isInitializing) return Promise.resolve()
    if (!accessToken() && !refreshToken()) {
      set({ farmer: null, isLoggedIn: false, isInitializing: false, sessionError: null })
      return Promise.resolve()
    }

    set({ isInitializing: true, sessionError: null })
    const promise = api.get('/farmers/me')
      .then(({ data }) => {
        if (version !== sessionVersion()) return
        if (!data.farmer?.id) throw new Error('Unable to load your profile')
        set({ farmer: data.farmer, isLoggedIn: true, isInitializing: false, sessionError: null })
      })
      .catch(error => {
        if (version !== sessionVersion()) return
        // Authentication failures are cleared centrally; an outage allows a retry.
        set({ farmer: null, isLoggedIn: false, isInitializing: false,
          sessionError: error.response?.status === 401 ? null : 'Unable to connect to your farm account. Please try again.' })
      })
      .finally(() => {
        if (initialization?.version === version) initialization = null
      })
    initialization = { version, promise }
    return promise
  },
}))

subscribeSession(() => {
  useAuthStore.setState({
    farmer: null, isLoggedIn: false, isInitializing: false, sessionError: null,
  })
})

export default useAuthStore
