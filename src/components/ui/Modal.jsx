import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
    const dialog = useRef(null)
    const titleId = useId()

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose() }
        if (isOpen) document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [isOpen, onClose])

    useEffect(() => {
        if (!isOpen) return
        const previousFocus = document.activeElement
        const previousOverflow = document.body.style.overflow
        const root = document.getElementById('root')
        const previousInert = root?.inert
        if (root) root.inert = true
        document.body.style.overflow = 'hidden'
        dialog.current?.focus()

        const trapFocus = event => {
            if (event.key !== 'Tab') return
            const controls = [...dialog.current.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
                .filter(element => element.getClientRects().length > 0)
            const first = controls[0]
            const last = controls.at(-1)
            if (!first) { event.preventDefault(); dialog.current.focus(); return }
            if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog.current)) {
                event.preventDefault()
                first.focus()
            }
        }
        document.addEventListener('keydown', trapFocus)
        return () => {
            document.removeEventListener('keydown', trapFocus)
            document.body.style.overflow = previousOverflow
            if (root) root.inert = previousInert
            if (previousFocus?.isConnected) previousFocus.focus()
        }
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
                ref={dialog}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                aria-label={title ? undefined : 'Confirmation'}
                tabIndex={-1}
                className={`w-full ${sizes[size]} rounded-2xl shadow-2xl overflow-y-auto`}
                style={{ background: 'var(--bg-primary)', maxHeight: 'calc(100dvh - 2rem)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div
                        className="flex items-center justify-between px-6 py-4"
                        style={{ borderBottom: '1px solid var(--border)' }}
                    >
                        <h3 id={titleId} className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {title}
                        </h3>
                        <button
                            type="button"
                            aria-label="Close confirmation"
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
