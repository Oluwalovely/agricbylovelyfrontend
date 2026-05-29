import { MapPin, Clock } from 'lucide-react'
import Badge from '../ui/Badge.jsx'


const ProgressRing = ({ value = 0, color = '#639922', size = 56 }) => {
    const radius = (size - 8) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (value / 100) * circumference

    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke="var(--bg-tertiary)" strokeWidth="4" />
            <circle cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke={color} strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
        </svg>
    )
}

const stageConfig = {
    GERMINATING: { variant: 'blue',   label: 'Germinating', color: '#185FA5' },
    SEEDLING:    { variant: 'blue',   label: 'Seedling',    color: '#185FA5' },
    GROWING:     { variant: 'green',  label: 'Growing',     color: '#639922' },
    FLOWERING:   { variant: 'purple', label: 'Flowering',   color: '#6C63FF' },
    MATURING:    { variant: 'amber',  label: 'Maturing',    color: '#BA7517' },
    READY:       { variant: 'green',  label: 'Ready',       color: '#3B6D11' },
    HARVESTED:   { variant: 'gray',   label: 'Harvested',   color: '#9CA3AF' },
}

const CropProgressCard = ({ farmerCrop }) => {
    if (!farmerCrop) return null

    const {
        crop,
        stage,
        progress,
        daysLeft,
        fieldName,
        isOverdue,
        
        cropName,
        imageUrl,
        botanicalName,
    } = farmerCrop

    
    const name     = crop?.name         ?? cropName
    const imgUrl   = crop?.imageUrl     ?? imageUrl
    const botName  = crop?.botanicalName ?? botanicalName

    if (!name) return null

    const config = stageConfig[stage] || stageConfig.GROWING
    const pct = progress || 0

    return (
        <div
            className="flex-shrink-0 rounded-2xl p-4 flex flex-col gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-1"
            style={{
                width: '180px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
            }}
        >
            {/* Crop image or placeholder */}
            <div
                className="w-full rounded-xl overflow-hidden flex items-center justify-center"
                style={{ height: '80px', background: 'var(--green-light)' }}
            >
                {imgUrl ? (
                    <img src={imgUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: 'var(--green-dark)', fontFamily: 'var(--font-serif)' }}>
                            {name?.[0]}
                        </div>
                    </div>
                )}
            </div>

            {/* Crop name and botanical name */}
            <div>
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {name}
                </p>
                {botName && (
                    <p className="text-xs truncate italic" style={{ color: 'var(--text-muted)' }}>
                        {botName}
                    </p>
                )}
            </div>

            {/* Progress ring + percentage */}
            <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                    <ProgressRing value={pct} color={isOverdue ? '#E24B4A' : config.color} size={52} />
                    <span
                        className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                        style={{ color: isOverdue ? '#E24B4A' : config.color }}
                    >
                        {pct}%
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <Badge variant={isOverdue ? 'red' : config.variant} size="sm">
                        {isOverdue ? 'Overdue' : config.label}
                    </Badge>
                    {daysLeft !== null && (
                        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                            <Clock size={10} />
                            {isOverdue
                                ? `${Math.abs(daysLeft)}d overdue`
                                : daysLeft === 0
                                    ? 'Harvest today'
                                    : `${daysLeft}d left`
                            }
                        </p>
                    )}
                </div>
            </div>

            {/* Field name */}
            {fieldName && (
                <div className="flex items-center gap-1.5">
                    <MapPin size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{fieldName}</span>
                </div>
            )}
        </div>
    )
}

export default CropProgressCard