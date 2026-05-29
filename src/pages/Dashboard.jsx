import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Sprout, ChevronRight } from 'lucide-react'
import { SkeletonBar } from '../components/ui/Skeleton.jsx'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import OnboardingFlow from '../components/onboarding/OnboardingFlow.jsx'
import SmartGreeting from '../components/dashboard/SmartGreeting.jsx'
import CropProgressCard from '../components/dashboard/CropProgressCard.jsx'
import WeatherWidget from '../components/dashboard/WeatherWidget.jsx'
import UpcomingHarvests from '../components/dashboard/UpcomingHarvests.jsx'
import RecentAlerts from '../components/dashboard/RecentAlerts.jsx'
import useOnboarding from '../hooks/useOnboarding.js'
import useAuthStore from '../store/authStore.js'
import reportService from '../services/report.service.js'

const Dashboard = () => {
    const { farmer } = useAuthStore()
    const { showOnboarding, completeOnboarding } = useOnboarding()
    const navigate = useNavigate()

    const { data, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => reportService.getDashboard().then(r => r.data),
        refetchInterval: 5 * 60 * 1000,
    })

    const dashboard = data

    return (
        <div className="page-enter">

            {showOnboarding && <OnboardingFlow onComplete={completeOnboarding} />}

            {/* Smart greeting */}
            {isLoading ? (
                <div className="mb-6">
                    <SkeletonBar height="32px" width="40%" className="mb-2" />
                    <SkeletonBar height="16px" width="25%" className="mb-4" />
                    <SkeletonBar height="56px" />
                </div>
            ) : (
                <SmartGreeting farmer={farmer} dashboard={dashboard} />
            )}

            {/* Active crops horizontal scroll */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Active crops
                    </h3>
                    <button onClick={() => navigate('/my-crops')}
                        className="flex items-center gap-1 text-xs font-medium"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--green-dark)' }}>
                        View all <ChevronRight size={12} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex gap-3 overflow-hidden">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex-shrink-0 rounded-2xl p-4"
                                style={{ width: '180px', background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                                <SkeletonBar height="80px" className="mb-3 rounded-xl" />
                                <SkeletonBar height="14px" width="70%" className="mb-1" />
                                <SkeletonBar height="12px" width="50%" className="mb-3" />
                                <SkeletonBar height="8px" />
                            </div>
                        ))}
                    </div>
                ) : dashboard?.activeCrops?.length > 0 ? (
                    <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                        {dashboard.activeCrops.map(fc => (
                            <CropProgressCard key={fc.id} farmerCrop={fc} />
                        ))}
                        <div onClick={() => navigate('/crops')}
                            className="flex-shrink-0 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-1"
                            style={{ width: '120px', background: 'var(--bg-primary)', border: '2px dashed var(--border)', minHeight: '200px' }}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ background: 'var(--green-light)' }}>
                                <Plus size={18} style={{ color: 'var(--green-dark)' }} />
                            </div>
                            <p className="text-xs font-medium text-center px-2" style={{ color: 'var(--green-dark)' }}>
                                Add crop
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                        <EmptyState
                            icon={Sprout}
                            title="No active crops yet"
                            message="Browse the encyclopedia and add your first crop to start tracking"
                            action={<Button icon={Plus} onClick={() => navigate('/crops')}>Browse crops</Button>}
                        />
                    </div>
                )}
            </div>

            {/* Bottom grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                    {isLoading ? (
                        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                            <SkeletonBar height="140px" round="none" />
                            <div className="p-4 flex flex-col gap-2" style={{ background: 'var(--bg-primary)' }}>
                                <SkeletonBar height="12px" />
                                <SkeletonBar height="12px" width="80%" />
                            </div>
                        </div>
                    ) : (
                        <WeatherWidget weather={dashboard?.weather} />
                    )}
                </div>
                <div>
                    {isLoading ? (
                        <div className="rounded-2xl p-4 flex flex-col gap-3"
                            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                            {[1, 2, 3].map(i => <SkeletonBar key={i} height="48px" />)}
                        </div>
                    ) : (
                        <UpcomingHarvests events={dashboard?.upcomingEvents || []} />
                    )}
                </div>
                <div>
                    {isLoading ? (
                        <div className="rounded-2xl p-4 flex flex-col gap-3"
                            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                            {[1, 2, 3].map(i => <SkeletonBar key={i} height="48px" />)}
                        </div>
                    ) : (
                        <RecentAlerts notifications={dashboard?.notifications || []} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard