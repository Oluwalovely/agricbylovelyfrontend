const Input = ({
    label,
    error,
    helper,
    icon: Icon,
    rightIcon: RightIcon,
    onRightIconClick,
    fullWidth = true,
    className = '',
    id,
    ...props // passes all other props like type, placeholder, value, onChange
}) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>

            {/* Label */}
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {label}
                </label>
            )}

            {/* Input wrapper */}
            <div className="relative flex items-center">

                {/* Left icon */}
                {Icon && (
                    <span className="absolute left-3 pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                        <Icon size={16} />
                    </span>
                )}

                <input
                    id={inputId}
                    className={`
            w-full rounded-xl border text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#639922] focus:border-transparent
            placeholder:text-gray-400
            ${Icon ? 'pl-9' : 'pl-3.5'}
            ${RightIcon ? 'pr-10' : 'pr-3.5'}
            py-2.5
            ${error
                            ? 'border-[#E24B4A] bg-[#FAECE7]'
                            : 'border-[var(--border)] bg-[var(--bg-primary)]'
                        }
            ${className}
          `}
                    style={{ color: 'var(--text-primary)' }}
                    {...props}
                />

                {/* Right icon — clickable e.g. show/hide password */}
                {RightIcon && (
                    <button
                        type="button"
                        onClick={onRightIconClick}
                        className="absolute right-3 cursor-pointer"
                        style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
                    >
                        <RightIcon size={16} />
                    </button>
                )}
            </div>

            {/* Error message */}
            {error && (
                <p className="text-xs text-[#E24B4A]">{error}</p>
            )}

            {/* Helper text */}
            {helper && !error && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{helper}</p>
            )}
        </div>
    )
}

export default Input