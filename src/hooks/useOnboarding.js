import { useState } from 'react'
import useAuthStore from '../store/authStore.js'

const useOnboarding = () => {
    const { farmer } = useAuthStore()

    // Check if this farmer has already completed onboarding
    const storageKey = farmer?.id ? `onboarding_complete_${farmer.id}` : null
    const alreadyDone = storageKey ? localStorage.getItem(storageKey) === 'true' : true
    const isNewFarmer = farmer?.createdAt
        ? (Date.now() - new Date(farmer.createdAt).getTime()) < 1000 * 60 * 10 // registered in last 10 minutes
        : false

    // Show onboarding if farmer is new and hasn't completed it yet
    const [showOnboarding, setShowOnboarding] = useState(isNewFarmer && !alreadyDone)

    const completeOnboarding = () => {
        if (storageKey) {
            localStorage.setItem(storageKey, 'true')
        }
        setShowOnboarding(false)
    }

    return { showOnboarding, completeOnboarding }
}

export default useOnboarding