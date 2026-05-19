import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Eye, EyeOff, Sprout, CheckCircle, AlertCircle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import authService from '../services/auth.service.js'

const schema = z.object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [success, setSuccess] = useState(false)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const token = searchParams.get('token')

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    })

    const { mutate, isPending, error } = useMutation({
        mutationFn: (data) => authService.resetPassword({ token, newPassword: data.newPassword }),
        onSuccess: () => {
            setSuccess(true)
            setTimeout(() => navigate('/login'), 3000)
        },
    })

    // No token in URL
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-secondary)' }}>
                <div className="w-full max-w-sm text-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--red-light)' }}>
                        <AlertCircle size={26} style={{ color: '#E24B4A' }} />
                    </div>
                    <h1 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Invalid reset link</h1>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>This password reset link is invalid or has expired.</p>
                    <Link to="/forgot-password">
                        <Button fullWidth>Request a new link</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: 'var(--bg-secondary)' }}>
            <div className="w-full max-w-sm">


                <div className="rounded-2xl p-8" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
                    {!success ? (
                        <>
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                            >
                                <Link to="/" className="flex items-center gap-2.5 no-underline">
                                    <div
                                        className="rounded-xl flex items-center justify-center"
                                        style={{ width: '120px' }}
                                    >
                                        <img src="/src/assets/logo.png" alt="AgricbyLovely" className="w-full h-full object-contain" />
                                    </div>
                                </Link>
                            </div>
                            <h1 className="text-xl font-semibold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
                                Set new password
                            </h1>
                            <p className="text-sm text-center mb-8" style={{ color: 'var(--text-muted)' }}>
                                Choose a strong password for your account.
                            </p>

                            {error && (
                                <div className="px-4 py-3 rounded-xl text-sm mb-5"
                                    style={{ background: 'var(--red-light)', color: '#712B13', border: '1px solid #E24B4A' }}>
                                    {error.response?.data?.message || 'This reset link has expired. Please request a new one.'}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(mutate)} className="flex flex-col gap-4">
                                <Input
                                    label="New password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="At least 8 characters"
                                    icon={Lock}
                                    rightIcon={showPassword ? EyeOff : Eye}
                                    onRightIconClick={() => setShowPassword(!showPassword)}
                                    error={errors.newPassword?.message}
                                    {...register('newPassword')}
                                />
                                <Input
                                    label="Confirm new password"
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="Repeat your password"
                                    icon={Lock}
                                    rightIcon={showConfirm ? EyeOff : Eye}
                                    onRightIconClick={() => setShowConfirm(!showConfirm)}
                                    error={errors.confirmPassword?.message}
                                    {...register('confirmPassword')}
                                />
                                <Button type="submit" fullWidth size="lg" loading={isPending}>
                                    Reset password
                                </Button>
                            </form>
                        </>
                    ) : (
                        // Success state
                        <>
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--green-light)' }}>
                                <CheckCircle size={26} style={{ color: 'var(--green-dark)' }} />
                            </div>
                            <h1 className="text-xl font-semibold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
                                Password reset successful
                            </h1>
                            <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                                Your password has been updated. Redirecting you to login...
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ResetPassword