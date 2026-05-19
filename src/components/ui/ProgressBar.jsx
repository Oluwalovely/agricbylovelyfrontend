const colors = {
    green: '#639922',
    amber: '#BA7517',
    blue: '#185FA5',
    red: '#E24B4A',
}

const heights = { sm: '4px', md: '8px' }

const ProgressBar = ({
    value = 0,
    color = 'green',
    size = 'sm',
    label,
    showPct = false,
    className = '',
}) => {
    const pct = Math.min(100, Math.max(0, value))

    return (
        <div className={`w-full ${className}`}>
            {(label || showPct) && (
                <div className="flex justify-between items-center mb-1">
                    {label && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>}
                    {showPct && <span className="text-xs font-medium" style={{ color: colors[color] }}>{pct}%</span>}
                </div>
            )}
            <div
                className="w-full rounded-full overflow-hidden"
                style={{ height: heights[size], background: 'var(--bg-tertiary)' }}
            >
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: colors[color] }}
                />
            </div>
        </div>
    )
}

export default ProgressBar