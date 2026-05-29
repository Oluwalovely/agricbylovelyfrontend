import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import ToastContainer from '../ui/Toast.jsx'
import useToast from '../../hooks/useToast.js'
import useSocket from '../../hooks/useSocket.js'
import usePageBackground from '../../hooks/usePageBackground.js'
import { useQueryClient } from '@tanstack/react-query'

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { toasts, toast, removeToast } = useToast()
    const queryClient = useQueryClient()
    const bgImage = usePageBackground()

    useSocket((notification) => {
        toast.info(notification.title, notification.message)
        queryClient.invalidateQueries({ queryKey: ['notifications-count'] })
    })

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
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* Scrollable page area with background image */}
                <main
                    className="flex-1 overflow-y-auto relative"
                    style={{ padding: '20px' }}
                >
                    {/* Background image layer */}
                    {bgImage && (
                        <div
                            aria-hidden="true"
                            style={{
                                position: 'fixed',
                                inset: 0,
                                backgroundImage: `url(${bgImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                opacity: 0.5,          
                                pointerEvents: 'none',
                                zIndex: 0,
                                transition: 'background-image 0.4s ease',
                            }}
                        />
                    )}

                    {/* Page content sits above the background */}
                    <div className="page-enter max-w-7xl mx-auto relative" style={{ zIndex: 1 }}>
                        <Outlet />
                    </div>
                </main>
            </div>

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    )
}

export default AppLayout