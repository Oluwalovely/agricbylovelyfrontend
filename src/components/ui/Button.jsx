import { Loader2 } from 'lucide-react'

const variants = {
    primary: 'bg-[#3B6D11] hover:bg-[#639922] text-white shadow-sm hover:shadow-md',
    secondary: 'bg-[#EAF3DE] hover:bg-[#D4EAB8] text-[#3B6D11]',
    outline: 'border-2 border-[#3B6D11] text-[#3B6D11] hover:bg-[#EAF3DE] bg-transparent',
    ghost: 'text-[#4B5563] hover:text-[#3B6D11] hover:bg-[#F2F8EA] bg-transparent',
    danger: 'bg-[#E24B4A] hover:bg-[#c73b3a] text-white shadow-sm',
}

const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2',
}

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    iconPos = 'left',
    fullWidth = false,
    onClick,
    type = 'button',
    className = '',
}) => {
    const isDisabled = disabled || loading

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
        inline-flex items-center justify-center font-semibold
        rounded-full transition-all duration-200 cursor-pointer
        focus-visible:outline-2 focus-visible:outline-[#639922]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
        >
            {/* Left icon or spinner */}
            {loading ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                Icon && iconPos === 'left' && <Icon size={size === 'lg' ? 18 : 16} />
            )}

            {children}

            {/* Right icon */}
            {!loading && Icon && iconPos === 'right' && <Icon size={size === 'lg' ? 18 : 16} />}
        </button>
    )
}

export default Button