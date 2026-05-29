import { AlertTriangle, CloudRain, Wheat, Sprout, Sun, CloudSun } from 'lucide-react'

const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
}

const SmartGreeting = ({ farmer, dashboard }) => {
    const greeting = getTimeGreeting()
    const upcomingEvents = dashboard?.upcomingEvents || []
    const weatherAlerts = dashboard?.weather?.alerts || []
    const stats = dashboard?.stats || {}

    const urgentHarvest = upcomingEvents.find(e => e.type === 'HARVEST' && e.daysLeft <= 7)
    const overdueHarvest = upcomingEvents.find(e => e.type === 'OVERDUE')
    const criticalAlert = weatherAlerts.find(a => a.type === 'WEATHER' || a.type === 'PEST')

    const weatherIcon = () => {
        const desc = dashboard?.weather?.description?.toLowerCase() || ''
        if (desc.includes('rain') || desc.includes('storm')) return CloudRain
        if (desc.includes('cloud')) return CloudSun
        return Sun
    }
    const WeatherIcon = weatherIcon()

    const getFocusContent = () => {
        if (overdueHarvest) return {
            icon: Wheat, color: '#E24B4A', bg: '#FAECE7',
            message: <>Your <strong>{overdueHarvest.cropName}</strong> is overdue for harvest. Act now to preserve your yield.</>,
        }
        if (urgentHarvest) return {
            icon: Wheat, color: '#BA7517', bg: '#FAEEDA',
            message: <><strong>{urgentHarvest.cropName}</strong> is ready for harvest in <strong>{urgentHarvest.daysLeft} day{urgentHarvest.daysLeft !== 1 ? 's' : ''}</strong>. Start preparing your tools and storage.</>,
        }
        if (criticalAlert) return {
            icon: AlertTriangle, color: '#185FA5', bg: '#E6F1FB',
            message: <>{criticalAlert.message}</>,
        }
        return {
            icon: Sprout, color: 'var(--green-dark)', bg: 'var(--green-light)',
            message: <>
                <strong>{farmer?.farmName}</strong> has{' '}
                <strong>{stats.totalActiveCrops || 0} active crop{stats.totalActiveCrops !== 1 ? 's' : ''}</strong> across{' '}
                <strong>{stats.totalFields || 0} field{stats.totalFields !== 1 ? 's' : ''}</strong>
                {stats.totalHectares ? <> covering <strong>{stats.totalHectares} ha</strong></> : ''}.
                {stats.upcomingHarvests > 0
                    ? <> <strong>{stats.upcomingHarvests} harvest{stats.upcomingHarvests !== 1 ? 's' : ''}</strong> coming up soon.</>
                    : ' Everything is on track.'
                }
            </>,
        }
    }

    const focus = getFocusContent()
    const FocusIcon = focus.icon

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div>
                    <h2 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>
                        {greeting}, {farmer?.firstName}
                    </h2>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
                {dashboard?.weather && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                        style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                        <WeatherIcon size={16} style={{ color: 'var(--green-mid)' }} />
                        <span>{dashboard.weather.temp}°C</span>
                        <span style={{ color: 'var(--border-dark)' }}>·</span>
                        <span className="capitalize">{dashboard.weather.description}</span>
                    </div>
                )}
            </div>
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
                style={{ background: focus.bg, border: `1px solid ${focus.color}22` }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: focus.color + '22' }}>
                    <FocusIcon size={16} style={{ color: focus.color }} />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {focus.message}
                </p>
            </div>
        </div>
    )
}

export default SmartGreeting