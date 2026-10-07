import { useState, useEffect, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPortal } from 'react-dom'
import FarmForm from '../farm/FarmForm.jsx'
import Button from '../ui/Button.jsx'
import farmerService from '../../services/farmer.service.js'
import fieldService from '../../services/field.service.js'
import useAuthStore from '../../store/authStore.js'
import { apiErrorMessage } from '../../services/api.js'
import { invalidateFarm, panelStyle } from '../../lib/farmSetup.js'

export default function OnboardingFlow({ onComplete }) {
  const farmer = useAuthStore(s => s.farmer)
  const client = useQueryClient()
  const [step, setStep] = useState(1)
  const dialog = useRef(null)
  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.focus()
    const trap = event => {
      if (event.key !== 'Tab') return
      const controls = [...dialog.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled)')]
      const first = controls[0], last = controls.at(-1)
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog.current)) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', trap)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', trap); previousFocus?.focus() }
  }, [])
  const profile = useMutation({ mutationFn: farmerService.updateProfile, onSuccess: async ({ data }) => {
    useAuthStore.getState().setFarmer({ ...farmer, ...data.farmer })
    await invalidateFarm(client)
    setStep(2)
  } })
  const field = useMutation({ mutationFn: fieldService.create, onSuccess: async () => { await invalidateFarm(client); setStep(3) } })
  const pending = profile.isPending || field.isPending
  return createPortal(<div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-8" style={{ background: 'rgba(0,0,0,0.6)' }}>
    <section ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="setup-heading" className="max-w-2xl mx-auto rounded-2xl p-5 sm:p-7" style={panelStyle}>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4"><p className="text-sm">Farm setup ? Step {step} of 3</p><Button variant="ghost" disabled={pending} onClick={onComplete}>Finish later</Button></div>
      <h2 id="setup-heading" className="text-2xl mb-2">{step === 1 ? 'Check your farm details' : step === 2 ? 'Add a growing area' : 'Your changes are saved'}</h2>
      <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>{step === 1 ? 'Location is optional. You can continue if your browser cannot detect it.' : step === 2 ? 'Name your first field. You can add more or edit its details on the Fields page.' : 'Return to Profile or Fields whenever your farm details change.'}</p>
      {step === 1 && <FarmForm initial={farmer} kind="profile" pending={profile.isPending} error={profile.error && apiErrorMessage(profile.error)} onSave={data => profile.mutate(data)} />}
      {step === 2 && <FarmForm initial={{ soilType: farmer.soilType }} pending={field.isPending} error={field.error && apiErrorMessage(field.error)} onSave={data => field.mutate(data)} />}
      {step < 3 ? <Button variant="ghost" className="mt-4" disabled={pending} onClick={() => setStep(step + 1)}>Skip this step</Button> : <Button onClick={onComplete}>Go to my dashboard</Button>}
    </section>
  </div>, document.body)
}
