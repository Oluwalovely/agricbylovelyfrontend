import { NavLink, useNavigate } from 'react-router-dom'
import Modal from '../ui/Modal.jsx'
import {
    LayoutDashboard, Sprout, Wheat, MapPin, CloudSun,
    CalendarDays, Bell, BarChart3, User, LogOut, X, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '../../store/authStore.js'
import authService from '../../services/auth.service.js'

// Navigation items — each maps to a page
const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Sprout, label: 'Crop Encyclopedia', path: '/crops' },
    { icon: Wheat, label: 'My Crops', path: '/my-crops' },
    { icon: MapPin, label: 'My Fields', path: '/fields' },
    { icon: CloudSun, label: 'Weather', path: '/weather' },
    { icon: CalendarDays, label: 'Planting Calendar', path: '/calendar' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
]

const Sidebar = ({ isOpen, onClose }) => {
    const [collapsed, setCollapsed] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    const { farmer, clearAuth } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await authService.logout()
        } catch { }

        setShowLogoutModal(false)
        clearAuth()
        navigate('/login')
    }

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden"
                    style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
                    onClick={onClose}
                />
            )}

            {/* Sidebar panel */}
            <aside
                className={`
          fixed top-0 left-0 h-full z-50 flex flex-col overflow-hidden
          transition-all duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'md:w-16' : 'md:w-56'}
        `}
                style={{
                    background: 'var(--bg-primary)',
                    borderRight: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)',
                    width: '220px',
                }}
            >
                {/* Logo area */}
                <div
                    className="flex items-center justify-between px-4 py-4"
                    style={{ borderBottom: ' var(--border)', minHeight: '80px' }}
                >
                    {!collapsed && (
                        <div className="flex-1 flex items-center justify-center">
                            <div
                                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                
                            >
                                <img
                                    src="/src/assets/logo.png"
                                    alt="AgricbyLovely"
                                    className="w-18 h-18 object-contain"
                                    style={{ filter: 'brightness(1.15) contrast(1.1)' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Mobile close button */}
                    <button
                        onClick={onClose}
                        className="md:hidden p-1 rounded-lg"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                        <X size={18} />
                    </button>

                    {/* Desktop collapse toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden md:flex p-1 rounded-lg transition-colors"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>

                {/* Navigation items*/}
                <nav className="flex-1 overflow-y-auto py-3 px-2">
                    {navItems.map(({ icon: Icon, label, path }) => (
                        <NavLink
                            key={path}
                            to={path}
                            onClick={onClose} // close on mobile after clicking
                            className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1
                text-sm font-medium transition-all duration-150 no-underline
                ${isActive
                                    ? 'text-[#27500A] bg-[#EAF3DE]'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                                }
              `}
                            style={({ isActive }) => ({
                                borderLeft: isActive ? '3px solid var(--green-dark)' : '3px solid transparent',
                            })}
                        >
                            <Icon size={18} style={{ flexShrink: 0 }} />
                            {!collapsed && <span className="truncate">{label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* ── Farmer profile + logout ──────── */}
                <div
                    className="p-3"
                    style={{ borderTop: '1px solid var(--border)' }}
                >
                    {/* Profile link */}
                    <NavLink
                        to="/profile"
                        onClick={onClose}
                        className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1
              text-sm font-medium transition-all duration-150 no-underline
              ${isActive
                                ? 'text-[#27500A] bg-[#EAF3DE]'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                            }
            `}
                    >
                        {/* Avatar */}
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold"
                            style={{ background: 'var(--green-light)', color: 'var(--green-dark)' }}
                        >
                            {farmer?.avatarUrl
                                ? <img src={farmer.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
                                : (farmer?.firstName?.[0] || 'F')
                            }
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                                    {farmer?.firstName} {farmer?.lastName}
                                </p>
                                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                                    {farmer?.farmName}
                                </p>
                            </div>
                        )}
                    </NavLink>

                    {/* Logout button */}
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FAECE7'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                        <LogOut size={18} style={{ flexShrink: 0, color: '#E24B4A' }} />
                        {!collapsed && <span style={{ color: '#E24B4A' }}>Logout</span>}
                    </button>

                    {/* Logout confirmation modal */}
                    <Modal
                        isOpen={showLogoutModal}
                        onClose={() => setShowLogoutModal(false)}
                        title="Logout of AgricbyLovely?"
                        footer={
                            <>
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors"
                                    style={{
                                        background: 'var(--bg-tertiary)',
                                        border: '1px solid var(--border)',
                                        color: 'var(--text-primary)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Stay logged in
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white"
                                    style={{ background: '#E24B4A', border: 'none', cursor: 'pointer' }}
                                >
                                    Yes, logout
                                </button>
                            </>
                        }
                    >
                        <div className="text-center py-2">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                style={{ background: '#FAECE7' }}
                            >
                                <LogOut size={24} style={{ color: '#E24B4A' }} />
                            </div>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                You will need to sign in again to access your farm dashboard.
                            </p>
                        </div>
                    </Modal>
                </div>
            </aside>
        </>
    )
}

export default Sidebar