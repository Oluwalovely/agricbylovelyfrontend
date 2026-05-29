import { useNavigate } from 'react-router-dom'
import { Bell, CloudRain, Bug, Sprout, Wheat, ArrowRight, Settings } from 'lucide-react'
import EmptyState from '../ui/EmptyState.jsx'

const typeConfig = {
    WEATHER: { icon: CloudRain, color: '#185FA5', bg: '#E6F1FB' },
    PEST: { icon: Bug, color: '#BA7517', bg: '#FAEEDA' },
    PLANTING: { icon: Sprout, color: '#3B6D11', bg: '#EAF3DE' },
    HARVEST: { icon: Wheat, color: '#639922', bg: '#EAF3DE' },
    SYSTEM: { icon: Settings, color: '#9CA3AF', bg: '#F3F4F6' },
}

const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
}

const RecentAlerts = ({ notifications = [] }) => {
    const navigate = useNavigate()

    return (
        <div className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2">
                    <Bell size={16} style={{ color: 'var(--green-dark)' }} />
                    <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Recent alerts
                    </h4>
                </div>
                <button onClick={() => navigate('/notifications')}
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--green-dark)' }}>
                    View all <ArrowRight size={12} />
                </button>
            </div>

            {/* Alerts list */}
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {notifications.length === 0 ? (
                    <EmptyState
                        icon={Bell}
                        title="No alerts yet"
                        message="Weather and pest alerts will appear here"
                    />
                ) : (
                    notifications.slice(0, 4).map((notif, i) => {
                        const config = typeConfig[notif.type] || typeConfig.SYSTEM
                        const Icon = config.icon
                        return (
                            <div key={i}
                                className="flex items-start gap-3 px-5 py-3.5 transition-colors"
                                style={{
                                    borderColor: 'var(--border)',
                                    background: !notif.isRead ? 'var(--green-pale)' : 'transparent',
                                    borderLeft: !notif.isRead ? '3px solid var(--green-mid)' : '3px solid transparent',
                                }}
                            >
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{ background: config.bg }}>
                                    <Icon size={14} style={{ color: config.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                        {notif.title}
                                    </p>
                                    <p className="text-xs mt-0.5 leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                                        {notif.message}
                                    </p>
                                </div>
                                <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                    {timeAgo(notif.createdAt)}
                                </span>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default RecentAlerts