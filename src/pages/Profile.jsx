import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import FarmForm, { Message } from '../components/farm/FarmForm.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import farmerService from '../services/farmer.service.js'
import { apiErrorMessage } from '../services/api.js'
import useAuthStore from '../store/authStore.js'
import { invalidateFarm, panelStyle } from '../lib/farmSetup.js'

export default function Profile() {
  const { farmer, setFarmer, clearAuth } = useAuthStore()
  const client = useQueryClient()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [passwordError, setPasswordError] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const profile = useQuery({ queryKey: ['profile', farmer.id], queryFn: ({ signal }) => farmerService.getProfile(signal).then(r => r.data.farmer) })
  const save = useMutation({ mutationFn: farmerService.updateProfile, onSuccess: async ({ data }) => {
    setFarmer({ ...farmer, ...data.farmer }); setSaved(true); await invalidateFarm(client)
  } })
  const password = useMutation({ mutationFn: farmerService.changePassword, onSuccess: () => { clearAuth(); navigate('/login', { replace: true, state: { message: 'Password changed. Sign in with your new password.' } }) } })
  const remove = useMutation({ mutationFn: farmerService.deleteAccount, onSuccess: () => { clearAuth(); navigate('/register', { replace: true }) } })
  if (profile.isPending) return <p role="status">Loading your profile...</p>
  if (profile.error) return <div role="alert"><p>Unable to load your profile.</p><Button onClick={() => profile.refetch()}>Try again</Button></div>
  return <div className="max-w-4xl space-y-6">
    <header><h1 className="text-3xl mb-2">Your profile</h1><p style={{ color: 'var(--text-secondary)' }}>Keep your farm details and account information up to date.</p></header>
    <section className="rounded-2xl p-5 sm:p-7" style={panelStyle}>
      <Message>{saved && 'Your profile has been saved.'}</Message>
      <FarmForm key={profile.data.id} initial={profile.data} kind="profile" pending={save.isPending} error={save.error && apiErrorMessage(save.error)} onSave={data => { setSaved(false); save.mutate(data) }} />
    </section>
    <section className="rounded-2xl p-5 sm:p-7" style={panelStyle}>
      <h2 className="text-xl mb-2">Change password</h2><p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>After changing your password, sign in again to secure your account.</p>
      <form className="space-y-4 max-w-lg" onSubmit={e => { e.preventDefault(); setPasswordError(''); if (passwords.newPassword !== passwords.confirm) { setPasswordError('The new passwords do not match.'); return } password.mutate({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }) }}>
        <Input label="Current password" type="password" autoComplete="current-password" required value={passwords.currentPassword} onChange={e => setPasswords(v => ({ ...v, currentPassword: e.target.value }))} />
        <Input label="New password" type="password" autoComplete="new-password" required minLength={8} maxLength={100} value={passwords.newPassword} onChange={e => setPasswords(v => ({ ...v, newPassword: e.target.value }))} />
        <Input label="Confirm new password" type="password" autoComplete="new-password" required value={passwords.confirm} onChange={e => setPasswords(v => ({ ...v, confirm: e.target.value }))} />
        <Message error>{passwordError || (password.error && apiErrorMessage(password.error))}</Message><Button type="submit" loading={password.isPending}>Change password</Button>
      </form>
    </section>
    <section className="rounded-2xl p-5 sm:p-7" style={panelStyle}>
      <h2 className="text-xl mb-2">Delete account</h2><p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>This permanently removes your account, fields, crop records and notifications. This cannot be undone.</p>
      <form className="space-y-4 max-w-lg" onSubmit={e => { e.preventDefault(); if (confirmation === farmer.email) remove.mutate() }}>
        <Input label="Type your email to confirm deletion" type="email" value={confirmation} onChange={e => setConfirmation(e.target.value)} autoComplete="off" />
        <Message error>{remove.error && apiErrorMessage(remove.error)}</Message><Button variant="danger" type="submit" disabled={confirmation !== farmer.email} loading={remove.isPending}>Permanently delete my account</Button>
      </form>
    </section>
  </div>
}
