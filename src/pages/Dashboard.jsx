import OnboardingFlow from '../components/onboarding/OnboardingFlow.jsx'
import useOnboarding from '../hooks/useOnboarding.js'
import useAuthStore from '../store/authStore.js'

const Dashboard = () => {
    const { farmer } = useAuthStore()
    const { showOnboarding, completeOnboarding } = useOnboarding()

    return (
        <div>
            {/* Onboarding overlay — only shown to new farmers */}
            {showOnboarding && (
                <OnboardingFlow onComplete={completeOnboarding} />
            )}

            {/* Dashboard content placeholder — built on Day 6 */}
            <div className="page-enter">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Good morning, {farmer?.firstName}. 
                </p>
            </div>
        </div>
    )
}

export default Dashboard