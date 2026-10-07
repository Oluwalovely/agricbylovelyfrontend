import { useState } from 'react'
import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import Textarea from '../ui/Textarea.jsx'
import Button from '../ui/Button.jsx'
import { farmPayload, soilTypes, soilLabel } from '../../lib/farmSetup.js'

export function Message({ error, children }) {
  return children ? <p role={error ? 'alert' : 'status'} className="text-sm py-2" style={{ color: error ? 'var(--red)' : 'var(--green-dark)' }}>{children}</p> : null
}

export default function FarmForm({ initial, kind = 'field', onSave, pending, error, onCancel }) {
  const profile = kind === 'profile'
  const [values, setValues] = useState(() => Object.fromEntries((profile
    ? ['firstName', 'lastName', 'phone', 'farmName', 'farmSizeHa', 'soilType', 'state', 'latitude', 'longitude']
    : ['name', 'sizeHa', 'soilType', 'notes', 'latitude', 'longitude']).map(key => [key, initial?.[key] ?? (key === 'soilType' ? 'LOAMY' : '')])))
  const [localError, setLocalError] = useState('')
  const [locating, setLocating] = useState(false)
  const input = (key, label, props = {}) => <Input key={key} id={`${kind}-${key}`} label={label} value={values[key]} onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} {...props} />
  function locate() {
    setLocalError('')
    if (!navigator.geolocation) { setLocalError('Location detection is unavailable. Enter coordinates manually, or leave them blank.'); return }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(position => {
      setValues(v => ({ ...v, latitude: String(position.coords.latitude), longitude: String(position.coords.longitude) }))
      setLocating(false)
    }, () => { setLocating(false); setLocalError('Location could not be detected. Enter it manually or continue without coordinates.') }, { timeout: 10000 })
  }
  function submit(event) {
    event.preventDefault()
    setLocalError('')
    try { onSave(farmPayload(values, kind)) } catch (failure) { setLocalError(failure.message) }
  }
  return <form onSubmit={submit} className="space-y-5">
    <fieldset disabled={pending} className="space-y-5 min-w-0">
      {profile && <div className="grid sm:grid-cols-2 gap-4">{input('firstName', 'First name', { required: true, minLength: 2, maxLength: 50 })}{input('lastName', 'Last name', { required: true, minLength: 2, maxLength: 50 })}{input('phone', 'Phone number', { type: 'tel', maxLength: 50 })}<Input label="Email address" value={initial.email} readOnly helper="Your sign-in email" /></div>}
      {input(profile ? 'farmName' : 'name', profile ? 'Farm name' : 'Field name', { required: true, minLength: profile ? 2 : 1, maxLength: 100 })}
      <div className="grid sm:grid-cols-2 gap-4">{input(profile ? 'farmSizeHa' : 'sizeHa', 'Size (hectares)', { type: 'number', min: '0.000001', step: 'any' })}<Select id={`${kind}-soil`} label="Soil type" value={values.soilType} onChange={e => setValues(v => ({ ...v, soilType: e.target.value }))}>{soilTypes.map(soil => <option key={soil} value={soil}>{soilLabel(soil)}</option>)}</Select></div>
      {profile && input('state', 'State / region', { maxLength: 100 })}
      <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-base mb-2">{profile ? 'Farm location' : 'Field location'} <span className="text-sm font-normal">(optional)</span></h3>
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Use this device’s location only when you are at the farm. Coordinates help locate weather conditions; a state alone does not provide a precise location.</p>
        <Button variant="secondary" loading={locating} onClick={locate}>Use my current location</Button>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">{input('latitude', 'Latitude', { type: 'number', min: -90, max: 90, step: 'any' })}{input('longitude', 'Longitude', { type: 'number', min: -180, max: 180, step: 'any' })}</div>
      </div>
      {!profile && <Textarea label="Field notes" maxLength={5000} value={values.notes} onChange={e => setValues(v => ({ ...v, notes: e.target.value }))} />}
    </fieldset>
    <Message error>{localError || error}</Message>
    <div className="flex flex-wrap gap-3">{onCancel && <Button variant="ghost" disabled={pending} onClick={onCancel}>Cancel</Button>}<Button type="submit" loading={pending}>Save {profile ? 'profile' : 'field'}</Button></div>
  </form>
}
