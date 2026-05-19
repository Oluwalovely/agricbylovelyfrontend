const EmptyState = ({ icon: Icon, title, message, action }) => (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        {Icon && (
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'var(--green-light)' }}
            >
                <Icon size={28} style={{ color: 'var(--green-dark)' }} />
            </div>
        )}
        <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {title}
        </h3>
        {message && (
            <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
                {message}
            </p>
        )}
        {action && <div>{action}</div>}
    </div>
)

export default EmptyState