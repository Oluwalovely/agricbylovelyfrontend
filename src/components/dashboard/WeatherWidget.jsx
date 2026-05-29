import { Wind, Droplets, Eye, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../ui/Badge.jsx'

const alertVariant = (type) => {
    if (type === 'WEATHER') return 'blue'
    if (type === 'PEST') return 'amber'
    if (type === 'HARVEST') return 'green'
    return 'gray'
}

const WeatherWidget = ({ weather }) => {
    const navigate = useNavigate()

    if (!weather) return (
        <div className="rounded-2xl p-5 flex items-center justify-center h-full"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', minHeight: '200px' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Update your farm location to see weather
            </p>
        </div>
    )

    return (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>

            {/* Current weather header */}
            <div style={{ background: 'linear-gradient(135deg, var(--green-dark), #27500A)', padding: '20px' }}>
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                            Current conditions
                        </p>
                        <div className="flex items-end gap-2">
                            <span className="text-5xl font-semibold text-white" style={{ fontFamily: 'var(--font-serif)', lineHeight: 1 }}>
                                {weather.temp}°
                            </span>
                            <span className="text-sm pb-1 capitalize" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                {weather.description}
                            </span>
                        </div>
                        <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            Feels like {weather.feelsLike || weather.temp}°C
                        </p>
                    </div>

                    {/* Weather stats */}
                    <div className="flex flex-col gap-2 text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                            <Droplets size={13} style={{ color: 'rgba(255,255,255,0.7)' }} />
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{weather.humidity}%</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-end">
                            <Wind size={13} style={{ color: 'rgba(255,255,255,0.7)' }} />
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{weather.windSpeed}m/s</span>
                        </div>
                        {weather.visibility && (
                            <div className="flex items-center gap-1.5 justify-end">
                                <Eye size={13} style={{ color: 'rgba(255,255,255,0.7)' }} />
                                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{(weather.visibility / 1000).toFixed(0)}km</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3-day forecast */}
            {weather.forecast && weather.forecast.length > 0 && (
                <div className="grid grid-cols-3 divide-x" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    {weather.forecast.slice(0, 3).map((day, i) => (
                        <div key={i} className="px-3 py-3 text-center" style={{ borderColor: 'var(--border)' }}>
                            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                                {i === 0 ? 'Tomorrow' : new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                            </p>
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {day.tempMax}°
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{day.tempMin}°</p>
                            {day.rainfallMm > 0 && (
                                <p className="text-xs mt-1" style={{ color: '#185FA5' }}>{day.rainfallMm}mm</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Alerts */}
            {weather.alerts && weather.alerts.length > 0 && (
                <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Farming alerts
                    </p>
                    <div className="flex flex-col gap-1.5">
                        {weather.alerts.slice(0, 2).map((alert, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Badge variant={alertVariant(alert.type)} size="sm">{alert.title}</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* View full weather link */}
            <button
                onClick={() => navigate('/weather')}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors"
                style={{
                    background: 'var(--bg-tertiary)',
                    borderTop: '1px solid var(--border)',
                    color: 'var(--green-dark)',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                View full forecast
                <ArrowRight size={14} />
            </button>
        </div>
    )
}

export default WeatherWidget