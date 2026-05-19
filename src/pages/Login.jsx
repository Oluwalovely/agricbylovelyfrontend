// ─────────────────────────────────────────
// LOGIN PAGE
// src\pages\Login.jsx
// ─────────────────────────────────────────
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import authService from '../services/auth.service.js'
import farmerService from '../services/farmer.service.js'
import useAuthStore from '../store/authStore.js'

const schema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
})

const Login = () => {
    const location = useLocation()
    const successMessage = location.state?.message
    const [showPassword, setShowPassword] = useState(false)
    const { setAuth, setFarmer } = useAuthStore()
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    })

    const { mutate: login, isPending, error } = useMutation({
        mutationFn: (data) => authService.login(data),
        onSuccess: async (res) => {
            const { farmer, accessToken, refreshToken } = res.data
            setAuth(farmer, accessToken, refreshToken)
            try {
                const profile = await farmerService.getProfile()
                setFarmer(profile.data.farmer)
            } catch { }
            navigate('/dashboard')
        },
    })

    return (
        <div className="min-h-screen flex" style={{ background: 'var(--bg-secondary)' }}>

            {/* Left panel form */}
            <div
                className="flex-1 flex flex-col px-8 lg:px-16"
                style={{ minHeight: '100vh', justifyContent: 'center' }}
            >
                <div className="w-full max-w-sm mx-auto">

                    {/* Logo + heading block */}
                    <div className="mb-10">
                        <Link to="/" className="flex items-center gap-2.5 no-underline mb-2">
                            <div className="rounded-xl flex items-center justify-center" style={{ width: '40%' }}>
                                <img
                                    src="/src/assets/logo.png"
                                    alt="AgricbyLovely"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </Link>
                        <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                            Welcome back
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            Sign in to your farm account
                        </p>
                    </div>

                    {/* Success message from registration */}
                    {successMessage && (
                        <div
                            className="px-4 py-3 rounded-xl text-sm mb-5"
                            style={{ background: 'var(--green-light)', color: '#27500A', border: '1px solid #639922' }}
                        >
                            {successMessage}
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div
                            className="px-4 py-3 rounded-xl text-sm mb-5"
                            style={{ background: 'var(--red-light)', color: '#712B13', border: '1px solid #E24B4A' }}
                        >
                            {error.response?.data?.message || 'Invalid email or password'}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(login)} className="flex flex-col gap-4">
                        <Input
                            label="Email address"
                            type="email"
                            icon={Mail}
                            placeholder="you@example.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />
                        <Input
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            icon={Lock}
                            placeholder="Your password"
                            rightIcon={showPassword ? EyeOff : Eye}
                            onRightIconClick={() => setShowPassword(!showPassword)}
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        {/* Forgot password */}
                        <div className="flex justify-end -mt-2">
                            <Link
                                to="/forgot-password"
                                className="text-sm no-underline font-medium"
                                style={{ color: 'var(--green-dark)' }}
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" fullWidth loading={isPending} size="lg">
                            Sign in
                        </Button>
                    </form>

                    {/* Register link */}
                    <p className="text-sm text-center mt-6" style={{ color: 'var(--text-muted)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold no-underline" style={{ color: 'var(--green-dark)' }}>
                            Create one free
                        </Link>
                    </p>

                    {/* Bottom trust note */}
                    <div className="mt-12 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                            Your farm data is secure and encrypted. We never share your information.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right panel decorative */}
            <div
                className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative overflow-hidden"
            >
                {/* Background farm photo */}
                <img
                    src="/src/assets/agricbylov1.avif"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Green overlay */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(145deg, rgba(39,80,10,0.80), rgba(39,80,10,0.60))' }}
                />
                {/* Content */}
                <div className="max-w-xs text-center relative z-10">
                    <div className="w-40 mx-auto mb-6">
                        <img
                            src="/src/assets/logo.png"
                            alt="AgricbyLovely"
                            className="w-full h-full object-contain"
                            style={{ filter: 'brightness(0) invert(1)' }}
                        />
                    </div>
                    <h2
                        className="text-3xl font-semibold text-white mb-4"
                        style={{ fontFamily: 'var(--font-serif)' }}
                    >
                        Farm smarter every day
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        Get real-time weather alerts, track your crops and plan your planting season with intelligent tools built for Nigerian farmers.
                    </p>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
                        {['Real-time alerts', 'Secure & private', 'Built for Nigeria'].map(badge => (
                            <span
                                key={badge}
                                className="text-xs px-3 py-1.5 rounded-full font-medium"
                                style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}
                            >
                                {badge}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login