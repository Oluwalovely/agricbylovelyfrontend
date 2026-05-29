import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Bell, Sun, Moon, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import useAuthStore from '../../store/authStore.js'
import useThemeStore from '../../store/themeStore.js'
import notificationService from '../../services/notification.service.js'


const pageTitles = {
    '/dashboard': 'Dashboard',
    '/crops': 'Crop Encyclopedia',
    '/my-crops': 'My Crops',
    '/fields': 'My Fields',
    '/weather': 'Weather & Alerts',
    '/calendar': 'Planting Calendar',
    '/notifications': 'Notifications',
    '/reports': 'Reports',
    '/profile': 'Farm Profile',
}

const Topbar = ({ onMenuClick }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { farmer } = useAuthStore()
    const { isDark, toggleTheme } = useThemeStore()

    const pageTitle = pageTitles[location.pathname] || 'AgricbyLovely'

    // Fetch unread notification count
    const { data } = useQuery({
        queryKey: ['notifications-count'],
        queryFn: () => notificationService.getAll({ limit: 1 }).then(r => r.data),
        refetchInterval: 30000, // refetch every 30 seconds
    })

    const unreadCount = data?.unreadCount || 0

    return (
        <header
            className="flex items-center justify-between px-4 md:px-6 gap-4"
            style={{
                height: '64px',
                background: 'var(--bg-primary)',
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: 0,
                zIndex: 30,
                boxShadow: 'var(--shadow-sm)',
            }}
        >
            {/* Left side */}
            <div className="flex items-center gap-3">
                {/* Hamburger — mobile only */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-xl transition-colors"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                    <Menu size={20} />
                </button>

                {/* Page title */}
                <h1
                    className="text-base font-semibold"
                    style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}
                >
                    {pageTitle}
                </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">

                {/* Search button — navigates to crops search */}
                <button
                    onClick={() => navigate('/crops')}
                    className="hidden md:flex p-2 rounded-xl transition-colors items-center gap-2 text-sm"
                    style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        minWidth: '160px',
                    }}
                >
                    <Search size={14} />
                    <span>Search crops...</span>
                </button>

                {/* Dark mode toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                    style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                    }}
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                {/* Notification bell */}
                <button
                    onClick={() => navigate('/notifications')}
                    className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                    style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border)',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                    }}
                    title="Notifications"
                >
                    <Bell size={16} />
                    {/* Unread badge */}
                    {unreadCount > 0 && (
                        <span
                            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-white"
                            style={{
                                background: 'var(--green-dark)',
                                fontSize: '10px',
                                fontWeight: 600,
                                padding: '0 4px',
                                border: '2px solid var(--bg-primary)',
                            }}
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* Farmer avatar — links to profile */}
                <button
                    onClick={() => navigate('/profile')}
                    className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden text-sm font-semibold transition-opacity hover:opacity-80"
                    style={{
                        background: 'var(--green-light)',
                        color: 'var(--green-dark)',
                        border: '2px solid var(--border)',
                        cursor: 'pointer',
                        flexShrink: 0,
                    }}
                    title="My profile"
                >
                    {farmer?.avatarUrl ? (
                        <img src={farmer.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span>{farmer?.firstName?.[0] || 'F'}</span>
                    )}
                </button>
            </div>
        </header>
    )
}

export default Topbar