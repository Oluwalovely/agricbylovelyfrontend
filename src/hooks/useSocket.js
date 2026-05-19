import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import useAuthStore from '../store/authStore.js'


const useSocket = (onNotification) => {
    const socketRef = useRef(null)
    const { farmer, isLoggedIn } = useAuthStore()

    useEffect(() => {
        if (!isLoggedIn || !farmer) return

        // Connect to the backend Socket.io server
        socketRef.current = io(
            import.meta.env.VITE_SOCKET_URL || 'http://localhost:8001',
            { withCredentials: true }
        )

        const socket = socketRef.current

        socket.on('connect', () => {
            // Join the farmer's private room
            socket.emit('join', farmer.id)
            console.log('Socket connected and joined farmer room')
        })

        // Listen for new notifications pushed from the server
        socket.on('new_notification', (notification) => {
            if (onNotification) onNotification(notification)
        })

        socket.on('disconnect', () => {
            console.log('Socket disconnected')
        })

        // Cleanup on unmount or logout
        return () => {
            socket.disconnect()
        }
    }, [isLoggedIn, farmer?.id])

    return socketRef.current
}

export default useSocket