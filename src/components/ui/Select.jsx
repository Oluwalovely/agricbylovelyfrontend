import { ChevronDown } from 'lucide-react'

const Select = ({
    label,
    error,
    helper,
    fullWidth = true,
    className = '',
    children,
    id,
    ...props
}) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label htmlFor={selectId} className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={selectId}
                    className={`
            w-full rounded-xl border text-sm py-2.5 pl-3.5 pr-9
            appearance-none transition-all duration-200 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-[#639922] focus:border-transparent
            ${error ? 'border-[#E24B4A] bg-[#FAECE7]' : 'border-[var(--border)] bg-[var(--bg-primary)]'}
            ${className}
          `}
                    style={{ color: 'var(--text-primary)' }}
                    {...props}
                >
                    {children}
                </select>
                <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'var(--text-muted)' }}
                />
            </div>
            {error && <p className="text-xs text-[#E24B4A]">{error}</p>}
            {helper && !error && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{helper}</p>}
        </div>
    )
}

export default Select