const Textarea = ({
    label, error, helper,
    fullWidth = true, className = '', rows = 4, id, ...props
}) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
        <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label htmlFor={textareaId} className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                rows={rows}
                className={`
          w-full rounded-xl border text-sm px-3.5 py-2.5 resize-none
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#639922] focus:border-transparent
          placeholder:text-gray-400
          ${error ? 'border-[#E24B4A] bg-[#FAECE7]' : 'border-[var(--border)] bg-[var(--bg-primary)]'}
          ${className}
        `}
                style={{ color: 'var(--text-primary)' }}
                {...props}
            />
            {error && <p className="text-xs text-[#E24B4A]">{error}</p>}
            {helper && !error && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{helper}</p>}
        </div>
    )
}

export default Textarea