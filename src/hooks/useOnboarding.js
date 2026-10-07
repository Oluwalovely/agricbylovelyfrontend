import { useState } from 'react'
import useAuthStore from '../store/authStore.js'
import { useQuery } from '@tanstack/react-query'
import fieldService from '../services/field.service.js'
import { needsFarmSetup } from '../lib/farmSetup.js'

const useOnboarding = () => {
    const { farmer } = useAuthStore()
    const [dismissed, setDismissed] = useState(false)
    const fields = useQuery({ queryKey: ['fields', farmer?.id], enabled: !!farmer?.id,
        queryFn: ({ signal }) => fieldService.getAll(signal).then(r => r.data.fields) })

    // Check if this farmer has already completed onboarding
    const storageKey = farmer?.id ? `onboarding_complete_${farmer.id}` : null
    const alreadyDone = storageKey ? localStorage.getItem(storageKey) === 'true' : true
    // Saved farm data determines eligibility; account age never closes setup.
    // Keep an open wizard mounted while its own saves complete the setup.
    const [started, setStarted] = useState(false)
    const eligible = !dismissed && !alreadyDone && fields.isSuccess && needsFarmSetup(farmer, fields.data)
    if (eligible && !started) setStarted(true)
    const showOnboarding = !dismissed && !alreadyDone && (started || eligible)

    const completeOnboarding = () => {
        if (storageKey) {
            localStorage.setItem(storageKey, 'true')
        }
        setDismissed(true)
    }

    return { showOnboarding, completeOnboarding }
}

export default useOnboarding
