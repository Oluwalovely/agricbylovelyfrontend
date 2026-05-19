import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Sprout, ArrowLeft, CheckCircle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import authService from '../services/auth.service.js'

const schema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

const ForgotPassword = () => {
    const [submitted, setSubmitted] = useState(false)

    const { register, handleSubmit, formState: { errors }, getValues } = useForm({
        resolver: zodResolver(schema),
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => authService.forgotPassword(data.email),
        onSuccess: () => setSubmitted(true),
        onError: () => setSubmitted(true), // show success regardless to prevent email enumeration
    })

    return (
        <div
            className="min-h-screen flex items-center justify-center px-6 py-12"
            style={{ background: 'var(--bg-secondary)' }}
        >
            <div className="w-full max-w-sm">

                
                <div
                    className="rounded-2xl p-8"
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
                >
                    {!submitted ? (
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
                                Forgot your password?
                            </h1>
                            <p className="text-sm text-center mb-8" style={{ color: 'var(--text-muted)' }}>
                                Enter your email and we will send you a link to reset your password.
                            </p>
                            <form onSubmit={handleSubmit(mutate)} className="flex flex-col gap-4">
                                <Input
                                    label="Email address"
                                    type="email"
                                    placeholder="you@example.com"
                                    icon={Mail}
                                    error={errors.email?.message}
                                    {...register('email')}
                                />
                                <Button type="submit" fullWidth size="lg" loading={isPending}>
                                    Send reset link
                                </Button>
                            </form>
                        </>
                    ) : (
                        // Success state
                        <>
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                                style={{ background: 'var(--green-light)' }}
                            >
                                <CheckCircle size={26} style={{ color: 'var(--green-dark)' }} />
                            </div>
                            <h1 className="text-xl font-semibold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
                                Check your email
                            </h1>
                            <p className="text-sm text-center mb-2" style={{ color: 'var(--text-muted)' }}>
                                If an account exists for
                            </p>
                            <p className="text-sm font-semibold text-center mb-4" style={{ color: 'var(--green-dark)' }}>
                                {getValues('email')}
                            </p>
                            <p className="text-sm text-center mb-8" style={{ color: 'var(--text-muted)' }}>
                                you will receive a password reset link shortly. Check your spam folder if you don't see it.
                            </p>
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => setSubmitted(false)}
                            >
                                Try a different email
                            </Button>
                        </>
                    )}

                    {/* Back to login */}
                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 mt-6 text-sm no-underline font-medium"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <ArrowLeft size={14} />
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword