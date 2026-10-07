import { useEffect } from 'react'
import { io } from 'socket.io-client'
import useAuthStore from '../store/authStore.js'
import { accessToken } from '../services/session.js'
import { refreshAccessToken } from '../services/api.js'

const useSocket = (onNotification) => {
  const farmerId = useAuthStore(state => state.farmer?.id)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)

  useEffect(() => {
    if (!isLoggedIn || !farmerId) return
    let active = true
    let retryTimer
    let refreshing = false
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:8001', {
      withCredentials: true,
      auth: callback => callback({ token: accessToken() }),
    })

    const reconnect = async () => {
      if (!active || refreshing) return
      refreshing = true
      try {
        await refreshAccessToken()
        if (active) socket.connect()
      } catch {
        if (active && useAuthStore.getState().isLoggedIn) {
          retryTimer = setTimeout(reconnect, 10000)
        }
      } finally {
        refreshing = false
      }
    }
    socket.on('new_notification', onNotification)
    socket.on('connect_error', error => {
      if (error.data?.code === 'UNAUTHORIZED') void reconnect()
      else if (error.data?.code === 'UNAVAILABLE') {
        retryTimer = setTimeout(() => { if (active) socket.connect() }, 10000)
      }
    })
    socket.on('disconnect', reason => {
      if (reason === 'io server disconnect') void reconnect()
    })

    return () => {
      active = false
      clearTimeout(retryTimer)
      socket.disconnect()
    }
  }, [isLoggedIn, farmerId, onNotification])
}

export default useSocket
