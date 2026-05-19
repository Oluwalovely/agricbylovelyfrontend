import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose() }
        if (isOpen) document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [isOpen, onClose])

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen) return null

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-2xl',
    }

    // createPortal renders the modal directly into document.body
    // so it is never trapped inside a narrow parent like the sidebar
    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className={`w-full ${sizes[size]} rounded-2xl shadow-2xl`}
                style={{ background: 'var(--bg-primary)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div
                        className="flex items-center justify-between px-6 py-4"
                        style={{ borderBottom: '1px solid var(--border)' }}
                    >
                        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            style={{ color: 'var(--text-muted)', border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
                <div className="px-6 py-5">{children}</div>
                {footer && (
                    <div
                        className="px-6 py-4 flex items-center justify-end gap-3"
                        style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-tertiary)', borderRadius: '0 0 16px 16px' }}
                    >
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body // render here — completely outside the sidebar
    )
}

export default Modal