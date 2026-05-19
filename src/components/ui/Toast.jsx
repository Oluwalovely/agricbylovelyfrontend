import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

const config = {
    success: { icon: CheckCircle, bg: '#EAF3DE', border: '#639922', text: '#27500A', iconColor: '#639922' },
    error: { icon: AlertCircle, bg: '#FAECE7', border: '#E24B4A', text: '#712B13', iconColor: '#E24B4A' },
    warning: { icon: AlertTriangle, bg: '#FAEEDA', border: '#BA7517', text: '#633806', iconColor: '#BA7517' },
    info: { icon: Info, bg: '#E6F1FB', border: '#185FA5', text: '#0C447C', iconColor: '#185FA5' },
}

// Single toast item
const ToastItem = ({ toast, onRemove }) => {
    const c = config[toast.type] || config.info
    const Icon = c.icon

    return (
        <div
            className="flex items-start gap-3 p-4 rounded-2xl shadow-lg pointer-events-auto"
            style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                color: c.text,
                minWidth: '280px',
                maxWidth: '380px',
                animation: 'fadeIn 0.25s ease forwards',
            }}
        >
            <Icon size={18} style={{ color: c.iconColor, flexShrink: 0, marginTop: '1px' }} />
            <div className="flex-1">
                {toast.title && (
                    <p className="text-sm font-semibold">{toast.title}</p>
                )}
                {toast.message && (
                    <p className="text-xs mt-0.5" style={{ opacity: 0.85 }}>{toast.message}</p>
                )}
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.iconColor, padding: 0 }}
            >
                <X size={14} />
            </button>
        </div>
    )
}

// Toast container — renders all active toasts
const ToastContainer = ({ toasts, removeToast }) => {
    if (!toasts.length) return null

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    )
}

export default ToastContainer