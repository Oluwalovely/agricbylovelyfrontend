import { useId, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Button from '../ui/Button.jsx'
import { Message } from './FarmForm.jsx'
import photoService from '../../services/photo.service.js'
import { apiErrorMessage } from '../../services/api.js'
import { photoError } from '../../lib/photos.js'
import { invalidateFarm } from '../../lib/farmSetup.js'
import useAuthStore from '../../store/authStore.js'

export default function PhotoEditor({ kind, id, url, label }) {
  const inputId = useId()
  const client = useQueryClient()
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [inputVersion, setInputVersion] = useState(0)
  const [confirm, setConfirm] = useState(false)
  const [brokenUrl, setBrokenUrl] = useState(null)
  const mutation = useMutation({
    mutationFn: action => action === 'remove' ? photoService.remove(kind, id) : photoService.upload(kind, id, file),
    onSuccess: async ({ data }) => {
      if (kind === 'avatar') {
        const { farmer, setFarmer } = useAuthStore.getState()
        if (farmer?.id === id) setFarmer({ ...farmer, avatarUrl: data.avatarUrl })
      }
      setFile(null); setInputVersion(value => value + 1); setConfirm(false); setNotice(data.avatarUrl || data.photoUrl ? 'Photo saved.' : 'Photo removed.')
      await invalidateFarm(client)
    },
  })
  const pending = mutation.isPending
  return <div className="py-4 space-y-3">
    <h3 className="text-base">{label}</h3>
    {url && brokenUrl !== url ? <img src={url} onError={() => setBrokenUrl(url)} alt={label} className={kind === 'avatar' ? 'w-24 h-24 rounded-full object-cover' : 'w-full max-w-md h-48 object-cover rounded-xl'} />
      : <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{url ? 'This photo could not load. You can replace or remove it.' : 'No photo added yet.'}</p>}
    <form className="space-y-3" onSubmit={event => { event.preventDefault(); const problem = photoError(file); setError(problem); if (!problem) { setNotice(''); mutation.mutate('upload') } }}>
      <label htmlFor={inputId} className="text-sm block">Choose {url ? 'a replacement' : 'a photo'}</label>
      <input key={inputVersion} id={inputId} type="file" accept="image/jpeg,image/png,image/webp" disabled={pending} className="block w-full max-w-md text-sm" onChange={event => { setFile(event.target.files?.[0] || null); setError(''); setNotice(''); mutation.reset() }} aria-describedby={`${inputId}-help`} />
      <p id={`${inputId}-help`} className="text-xs" style={{ color: 'var(--text-secondary)' }}>JPEG, PNG or WebP. Maximum 5 MB. Your current photo stays until you save.</p>
      <div className="flex flex-wrap gap-2"><Button type="submit" loading={pending} disabled={!file}>{url ? 'Save replacement' : 'Save photo'}</Button>{url && <Button type="button" variant="ghost" disabled={pending} onClick={() => { setConfirm(true); setNotice(''); mutation.reset() }}>Remove photo</Button>}</div>
    </form>
    {confirm && <div className="text-sm space-y-2"><p>Remove this saved photo?</p><div className="flex gap-2"><Button variant="danger" disabled={pending} onClick={() => mutation.mutate('remove')}>Confirm removal</Button><Button variant="ghost" disabled={pending} onClick={() => setConfirm(false)}>Keep photo</Button></div></div>}
    <Message error>{error || (mutation.error && apiErrorMessage(mutation.error, 'Could not save the photo. Please try again.'))}</Message>
    <Message>{notice}</Message>
  </div>
}
