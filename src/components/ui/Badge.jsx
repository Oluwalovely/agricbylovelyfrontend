const variants = {
    green: { bg: '#EAF3DE', text: '#27500A', dot: '#639922' },
    amber: { bg: '#FAEEDA', text: '#633806', dot: '#BA7517' },
    blue: { bg: '#E6F1FB', text: '#0C447C', dot: '#185FA5' },
    red: { bg: '#FAECE7', text: '#712B13', dot: '#E24B4A' },
    gray: { bg: '#F3F4F6', text: '#374151', dot: '#9CA3AF' },
    purple: { bg: '#EEEDFE', text: '#3C3489', dot: '#6C63FF' },
}

const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
}

const Badge = ({
    children,
    variant = 'green',
    size = 'md',
    dot = false,
    className = '',
}) => {
    const v = variants[variant] || variants.gray

    return (
        <span
            className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${sizes[size]}
        ${className}
      `}
            style={{ background: v.bg, color: v.text }}
        >
            {dot && (
                <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: v.dot }}
                />
            )}
            {children}
        </span>
    )
}

export default Badge