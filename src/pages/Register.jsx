import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff, User, Sprout, MapPin, Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Select from '../components/ui/Select.jsx'
import authService from '../services/auth.service.js'
import useAuthStore from '../store/authStore.js'

const step1Schema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

const step2Schema = z.object({
    farmName: z.string().min(2, 'Farm name must be at least 2 characters'),
    state: z.string().min(1, 'Please select your state'),
    soilType: z.string().min(1, 'Please select a soil type'),
    farmSizeHa: z.string().optional(),
})

const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
    'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
    'Yobe', 'Zamfara',
]

const Register = () => {
    const [step, setStep] = useState(1)
    const [showPassword, setShowPassword] = useState(false)
    const [step1Data, setStep1Data] = useState(null)
    const [locating, setLocating] = useState(false)
    const [location, setLocation] = useState({ latitude: null, longitude: null })
    const { setAuth } = useAuthStore()
    const navigate = useNavigate()

    const form1 = useForm({ resolver: zodResolver(step1Schema) })
    const form2 = useForm({ resolver: zodResolver(step2Schema) })

    const detectLocation = () => {
        if (!navigator.geolocation) return
        setLocating(true)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
                setLocating(false)
            },
            () => setLocating(false)
        )
    }

    const { mutate: register, isPending, error } = useMutation({
        mutationFn: (data) => authService.register(data),
        onSuccess: () => {
            navigate('/login', {
                state: { message: 'Account created successfully. Please sign in to continue.' }
            })
        },
    })

    const onStep1Submit = (data) => {
        setStep1Data(data)
        setStep(2)
        detectLocation()
    }

    const onStep2Submit = (data) => {
        register({
            ...step1Data,
            ...data,
            farmSizeHa: data.farmSizeHa ? parseFloat(data.farmSizeHa) : undefined,
            ...location,
        })
    }

    return (
        <div className="min-h-screen flex" style={{ background: 'var(--bg-secondary)' }}>

            {/* Left panel decorative */}
            <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative overflow-hidden">
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
                        Join thousands of smart farmers
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        Free to start. No credit card required. Get weather alerts, track your crops and plan your harvest from day one.
                    </p>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
                        {['No hidden fees', 'Setup in 2 minutes', 'Free weather alerts'].map(badge => (
                            <span
                                key={badge}
                                className="text-xs px-3 py-1.5 rounded-full font-medium"
                                style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}
                            >
                                {badge}
                            </span>
                        ))}
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-3 mt-10">
                        {[1, 2].map(s => (
                            <div
                                key={s}
                                className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all"
                                style={{
                                    background: s === step ? '#fff' : 'rgba(255,255,255,0.2)',
                                    color: s === step ? 'var(--green-dark)' : 'rgba(255,255,255,0.7)',
                                }}
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Step {step} of 2
                    </p>
                </div>
            </div>

            {/* Right panel form  */}
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
                            {step === 1 ? 'Create your account' : 'Tell us about your farm'}
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {step === 1 ? 'Smart farming starts here.' : 'We use this to personalise your experience.'}
                        </p>
                    </div>

                    {/* Step indicator — mobile only */}
                    <div className="flex items-center gap-2 mb-6 lg:hidden">
                        {[1, 2].map(s => (
                            <div
                                key={s}
                                className="h-1.5 flex-1 rounded-full transition-all"
                                style={{ background: s <= step ? 'var(--green-dark)' : 'var(--border)' }}
                            />
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <div
                            className="px-4 py-3 rounded-xl text-sm mb-5"
                            style={{ background: 'var(--red-light)', color: '#712B13', border: '1px solid #E24B4A' }}
                        >
                            {error.response?.data?.message || 'Something went wrong. Please try again.'}
                        </div>
                    )}

                    {/* STEP 1 */}
                    {step === 1 && (
                        <form onSubmit={form1.handleSubmit(onStep1Submit)} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="First name"
                                    placeholder="Adewale"
                                    icon={User}
                                    error={form1.formState.errors.firstName?.message}
                                    {...form1.register('firstName')}
                                />
                                <Input
                                    label="Last name"
                                    placeholder="Ogun"
                                    error={form1.formState.errors.lastName?.message}
                                    {...form1.register('lastName')}
                                />
                            </div>
                            <Input
                                label="Email address"
                                type="email"
                                placeholder="you@example.com"
                                icon={Mail}
                                error={form1.formState.errors.email?.message}
                                {...form1.register('email')}
                            />
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="At least 8 characters"
                                icon={Lock}
                                rightIcon={showPassword ? EyeOff : Eye}
                                onRightIconClick={() => setShowPassword(!showPassword)}
                                error={form1.formState.errors.password?.message}
                                {...form1.register('password')}
                            />
                            <Button type="submit" fullWidth size="lg">
                                Continue to farm details
                            </Button>
                        </form>
                    )}

                    {/* STEP 2  */}
                    {step === 2 && (
                        <form onSubmit={form2.handleSubmit(onStep2Submit)} className="flex flex-col gap-4">
                            <Input
                                label="Farm name"
                                placeholder="e.g. Lovely Farms"
                                icon={Sprout}
                                error={form2.formState.errors.farmName?.message}
                                {...form2.register('farmName')}
                            />
                            <Select
                                label="State"
                                error={form2.formState.errors.state?.message}
                                {...form2.register('state')}
                            >
                                <option value="">Select your state</option>
                                {nigerianStates.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </Select>
                            <Select
                                label="Soil type"
                                error={form2.formState.errors.soilType?.message}
                                {...form2.register('soilType')}
                            >
                                <option value="">Select soil type</option>
                                <option value="LOAMY">Loamy — best for most crops</option>
                                <option value="CLAY">Clay — holds water well</option>
                                <option value="SANDY">Sandy — drains quickly</option>
                                <option value="SILTY">Silty — fertile and smooth</option>
                                <option value="PEATY">Peaty — rich in organic matter</option>
                                <option value="CHALKY">Chalky — alkaline soil</option>
                            </Select>
                            <Input
                                label="Farm size (hectares)"
                                type="number"
                                placeholder="e.g. 4.5"
                                helper="Optional — you can add this later"
                                {...form2.register('farmSizeHa')}
                            />

                            {/* Location status */}
                            <div
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
                                style={{
                                    background: location.latitude ? 'var(--green-light)' : 'var(--bg-tertiary)',
                                    border: '1px solid var(--border)',
                                    color: location.latitude ? 'var(--green-dark)' : 'var(--text-muted)',
                                }}
                            >
                                {locating
                                    ? <Loader2 size={15} className="animate-spin" />
                                    : <MapPin size={15} />
                                }
                                <span>
                                    {locating
                                        ? 'Detecting your location...'
                                        : location.latitude
                                            ? 'Farm location detected automatically'
                                            : 'Location not detected — you can add it from your profile'
                                    }
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    fullWidth
                                    onClick={() => setStep(1)}
                                    type="button"
                                >
                                    Back
                                </Button>
                                <Button type="submit" fullWidth size="lg" loading={isPending}>
                                    Create account
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Login link */}
                    <p className="text-sm text-center mt-6" style={{ color: 'var(--text-muted)' }}>
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold no-underline" style={{ color: 'var(--green-dark)' }}>
                            Sign in
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
        </div>
    )
}

export default Register