import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import ToastContainer from '../ui/Toast.jsx'
import useToast from '../../hooks/useToast.js'
import useSocket from '../../hooks/useSocket.js'
import { useQueryClient } from '@tanstack/react-query'

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { toasts, toast, removeToast } = useToast()
    const queryClient = useQueryClient()

    // Socket.io — listens for live notifications
    // When a new notification arrives, show a toast and refresh the count
    useSocket((notification) => {
        toast.info(notification.title, notification.message)
        // Refresh notification count in the topbar badge
        queryClient.invalidateQueries({ queryKey: ['notifications-count'] })
    })

    // Close sidebar when screen resizes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setSidebarOpen(false)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div
            className="flex h-screen overflow-hidden"
            style={{ background: 'var(--bg-secondary)' }}
        >
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* Scrollable page area */}
                <main
                    className="flex-1 overflow-y-auto"
                    style={{ padding: '20px' }}
                >
                    <div className="page-enter max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Toast notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    )
}

export default AppLayout