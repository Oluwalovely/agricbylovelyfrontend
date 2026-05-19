const padding = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
}

const Card = ({
    children,
    title,
    subtitle,
    action,
    footer,
    pad = 'md',
    hover = false,
    className = '',
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className={`
        rounded-2xl border
        ${hover ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
            style={{
                background: 'var(--bg-primary)',
                borderColor: 'var(--border)',
                boxShadow: 'var(--shadow-sm)',
            }}
        >
            {/* Header */}
            {(title || action) && (
                <div
                    className="flex items-center justify-between px-5 py-4"
                    style={{ borderBottom: '1px solid var(--border)' }}
                >
                    <div>
                        {title && (
                            <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {title}
                            </h4>
                        )}
                        {subtitle && (
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}

            {/* Body */}
            <div className={padding[pad]}>
                {children}
            </div>

            {/* Footer */}
            {footer && (
                <div
                    className="px-5 py-3"
                    style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}
                >
                    {footer}
                </div>
            )}
        </div>
    )
}

export default Card