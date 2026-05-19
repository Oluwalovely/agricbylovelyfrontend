import { useState, useCallback } from 'react'


const useToast = () => {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, type, title, message }])

        // Auto remove after duration
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, duration)
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    // Convenience methods
    const toast = {
        success: (title, message) => addToast({ type: 'success', title, message }),
        error: (title, message) => addToast({ type: 'error', title, message }),
        warning: (title, message) => addToast({ type: 'warning', title, message }),
        info: (title, message) => addToast({ type: 'info', title, message }),
    }

    return { toasts, toast, removeToast }
}

export default useToast