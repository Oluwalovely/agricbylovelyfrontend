import { useState } from 'react'
import { MapPin, Sprout, Compass, ChevronRight, X, Check, Loader2, CloudSun, Leaf, CalendarDays, Bell } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Button from '../ui/Button.jsx'
import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import farmerService from '../../services/farmer.service.js'
import fieldService from '../../services/field.service.js'

const steps = [
    {
        id: 1,
        icon: MapPin,
        title: 'Set your farm location',
        subtitle: 'We use this to send you accurate weather alerts for your area',
    },
    {
        id: 2,
        icon: Sprout,
        title: 'Add your first field',
        subtitle: 'Fields help you organise which crops are growing where',
    },
    {
        id: 3,
        icon: Compass,
        title: 'You are all set',
        subtitle: 'Here is a quick look at what you can do in AgricbyLovely',
    },
]

// Step 1 — Location 
const LocationStep = ({ onNext, onSkip }) => {
    const [locating, setLocating] = useState(false)
    const [detected, setDetected] = useState(false)
    const [location, setLocation] = useState({ latitude: null, longitude: null })
    const [state, setState] = useState('')

    const nigerianStates = [
        'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
        'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
        'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
        'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
        'Yobe', 'Zamfara',
    ]

    const { mutate: updateProfile, isPending } = useMutation({
        mutationFn: (data) => farmerService.updateProfile(data),
        onSuccess: () => onNext(),
    })

    const detectLocation = () => {
        if (!navigator.geolocation) return
        setLocating(true)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
                setDetected(true)
                setLocating(false)
            },
            () => setLocating(false)
        )
    }

    const handleSave = () => {
        updateProfile({ ...location, state })
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Auto detect button */}
            <button
                onClick={detectLocation}
                disabled={locating || detected}
                className="flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer w-full"
                style={{
                    borderColor: detected ? 'var(--green-mid)' : 'var(--border)',
                    background: detected ? 'var(--green-light)' : 'var(--bg-primary)',
                    border: 'none',
                }}
            >
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: detected ? 'var(--green-mid)' : 'var(--bg-tertiary)' }}
                >
                    {locating
                        ? <Loader2 size={20} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
                        : detected
                            ? <Check size={20} color="white" />
                            : <MapPin size={20} style={{ color: 'var(--green-dark)' }} />
                    }
                </div>
                <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {detected ? 'Location detected' : 'Detect my location automatically'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {detected
                            ? `Lat: ${location.latitude?.toFixed(4)}, Lon: ${location.longitude?.toFixed(4)}`
                            : 'Uses your device GPS — most accurate'
                        }
                    </p>
                </div>
            </button>

            {/* State selector */}
            <Select
                label="Your state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                helper="Select even if location was auto-detected"
            >
                <option value="">Select your state</option>
                {nigerianStates.map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </Select>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
                <Button variant="ghost" onClick={onSkip}>Skip for now</Button>
                <Button
                    fullWidth
                    loading={isPending}
                    onClick={handleSave}
                    disabled={!detected && !state}
                    icon={ChevronRight}
                    iconPos="right"
                >
                    Save and continue
                </Button>
            </div>
        </div>
    )
}

// Step 2  First field
const FieldStep = ({ onNext, onSkip }) => {
    const [name, setName] = useState('')
    const [soilType, setSoilType] = useState('LOAMY')
    const [sizeHa, setSizeHa] = useState('')

    const { mutate: createField, isPending } = useMutation({
        mutationFn: (data) => fieldService.create(data),
        onSuccess: () => onNext(),
    })

    const handleSave = () => {
        if (!name.trim()) return
        createField({
            name,
            soilType,
            sizeHa: sizeHa ? parseFloat(sizeHa) : undefined,
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <Input
                label="Field name"
                placeholder="e.g. Field A, North Plot, Back Garden"
                value={name}
                onChange={(e) => setName(e.target.value)}
                helper="Give it a name you will recognise easily"
            />
            <Select
                label="Soil type"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
            >
                <option value="LOAMY">Loamy — best for most crops</option>
                <option value="CLAY">Clay — holds water well</option>
                <option value="SANDY">Sandy — drains quickly</option>
                <option value="SILTY">Silty — fertile and smooth</option>
                <option value="PEATY">Peaty — rich in organic matter</option>
                <option value="CHALKY">Chalky — alkaline soil</option>
            </Select>
            <Input
                label="Field size (hectares)"
                type="number"
                placeholder="e.g. 2.5"
                value={sizeHa}
                onChange={(e) => setSizeHa(e.target.value)}
                helper="Optional — you can update this later"
            />

            <div className="flex gap-3 mt-2">
                <Button variant="ghost" onClick={onSkip}>Skip for now</Button>
                <Button
                    fullWidth
                    loading={isPending}
                    onClick={handleSave}
                    disabled={!name.trim()}
                    icon={ChevronRight}
                    iconPos="right"
                >
                    Create field
                </Button>
            </div>
        </div>
    )
}

// Step 3 Walkthrough 
const WalkthroughStep = ({ onFinish }) => {
    const features = [
        {
            icon: CloudSun,
            title: 'Weather alerts',
            desc: 'Check the Weather page every morning for farming alerts specific to your zone.',
        },
        {
            icon: Leaf,
            title: 'Add your crops',
            desc: 'Browse the Crop Encyclopedia, find what you are growing and click Plant this crop.',
        },
        {
            icon: CalendarDays,
            title: 'Planting calendar',
            desc: 'Your Planting Calendar shows all your crops with harvest countdowns.',
        },
        {
            icon: Bell,
            title: 'Stay notified',
            desc: 'The bell icon shows real-time alerts. Check Notifications to see your full history.',
        },
    ]

    return (
        <div className="flex flex-col gap-3">
            {features.map((f, i) => {
                const Icon = f.icon
                return (
                    <div
                        key={i}
                        className="flex items-start gap-4 p-4 rounded-xl"
                        style={{ background: 'var(--bg-tertiary)' }}
                    >
                        <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'var(--green-light)' }}
                        >
                            <Icon size={18} style={{ color: 'var(--green-dark)' }} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                                {f.title}
                            </p>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                {f.desc}
                            </p>
                        </div>
                    </div>
                )
            })}

            <Button fullWidth size="lg" onClick={onFinish} className="mt-2">
                Go to my dashboard
            </Button>
        </div>
    )
}

// Main OnboardingFlow component 
const OnboardingFlow = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(1)

    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1)
        else onComplete()
    }

    const currentStepData = steps[currentStep - 1]
    const Icon = currentStepData.icon

    return (
        // Full screen overlay
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
        >
            <div
                className="w-full max-w-md rounded-3xl overflow-hidden"
                style={{ background: 'var(--bg-primary)', boxShadow: 'var(--shadow-lg)' }}
            >
                {/* Header */}
                <div
                    className="px-6 pt-6 pb-5"
                    style={{ background: 'linear-gradient(135deg, var(--green-dark), #27500A)' }}
                >
                    {/* Step indicator dots */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex gap-2">
                            {steps.map(s => (
                                <div
                                    key={s.id}
                                    className="h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                        width: s.id === currentStep ? '24px' : '8px',
                                        background: s.id <= currentStep ? '#fff' : 'rgba(255,255,255,0.3)',
                                    }}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            {currentStep} of {steps.length}
                        </span>
                    </div>

                    {/* Step icon and title */}
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: 'rgba(255,255,255,0.15)' }}
                    >
                        <Icon size={24} color="white" />
                    </div>
                    <h2
                        className="text-xl font-semibold text-white mb-1"
                        style={{ fontFamily: 'var(--font-serif)' }}
                    >
                        {currentStepData.title}
                    </h2>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        {currentStepData.subtitle}
                    </p>
                </div>

                {/* Body */}
                <div className="p-6">
                    {currentStep === 1 && (
                        <LocationStep onNext={nextStep} onSkip={nextStep} />
                    )}
                    {currentStep === 2 && (
                        <FieldStep onNext={nextStep} onSkip={nextStep} />
                    )}
                    {currentStep === 3 && (
                        <WalkthroughStep onFinish={onComplete} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default OnboardingFlow