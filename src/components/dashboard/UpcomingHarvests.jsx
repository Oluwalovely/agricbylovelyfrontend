import { useNavigate } from 'react-router-dom'
import { CalendarDays, ArrowRight, MapPin } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import EmptyState from '../ui/EmptyState.jsx'

const urgencyConfig = {
    HIGH: { variant: 'red', label: 'Urgent' },
    MEDIUM: { variant: 'amber', label: 'Soon' },
    LOW: { variant: 'green', label: 'Upcoming' },
}

const UpcomingHarvests = ({ events = [] }) => {
    const navigate = useNavigate()

    return (
        <div className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2">
                    <CalendarDays size={16} style={{ color: 'var(--green-dark)' }} />
                    <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Upcoming harvests
                    </h4>
                </div>
                <button onClick={() => navigate('/calendar')}
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--green-dark)' }}>
                    View calendar <ArrowRight size={12} />
                </button>
            </div>

            {/* List */}
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {events.length === 0 ? (
                    <EmptyState
                        icon={CalendarDays}
                        title="No upcoming harvests"
                        message="Add crops to see your harvest schedule here"
                    />
                ) : (
                    events.slice(0, 5).map((event, i) => {
                        const config = urgencyConfig[event.urgency] || urgencyConfig.LOW
                        return (
                            <div key={i} className="flex items-center gap-3 px-5 py-3.5"
                                style={{ borderColor: 'var(--border)' }}>
                                {/* Days left indicator */}
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex flex-col items-center justify-center"
                                    style={{ background: event.urgency === 'HIGH' ? '#FAECE7' : 'var(--green-light)' }}>
                                    <span className="text-sm font-bold leading-none"
                                        style={{ color: event.urgency === 'HIGH' ? '#E24B4A' : 'var(--green-dark)' }}>
                                        {event.type === 'OVERDUE' ? '!' : event.daysLeft}
                                    </span>
                                    <span className="text-xs leading-none mt-0.5"
                                        style={{ color: event.urgency === 'HIGH' ? '#E24B4A' : 'var(--green-dark)' }}>
                                        {event.type === 'OVERDUE' ? 'late' : 'days'}
                                    </span>
                                </div>

                                {/* Crop info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                        {event.cropName}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        {event.fieldName && (
                                            <>
                                                <MapPin size={11} style={{ color: 'var(--text-muted)' }} />
                                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{event.fieldName}</span>
                                                <span style={{ color: 'var(--border-dark)' }}>·</span>
                                            </>
                                        )}
                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{event.date}</span>
                                    </div>
                                </div>

                                <Badge variant={config.variant} size="sm">{config.label}</Badge>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default UpcomingHarvests