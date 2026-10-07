import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import Textarea from '../ui/Textarea.jsx'
import Button from '../ui/Button.jsx'
import { Message } from '../farm/FarmForm.jsx'
import cropService from '../../services/crop.service.js'
import fieldService from '../../services/field.service.js'
import useAuthStore from '../../store/authStore.js'
import { apiErrorMessage } from '../../services/api.js'
import { invalidateFarm } from '../../lib/farmSetup.js'
import { localDate, plantingPayload, harvestEstimate } from '../../lib/planting.js'

export default function PlantCropForm({ crop }) {
  const farmer = useAuthStore(s => s.farmer)
  const client = useQueryClient()
  const [params] = useSearchParams()
  const [values, setValues] = useState({ plantedAt: localDate(), fieldId: params.get('field') || '', quantity: '', notes: '' })
  const [localError, setLocalError] = useState('')
  const [record, setRecord] = useState(null)
  const fields = useQuery({ queryKey: ['fields', farmer.id], queryFn: ({ signal }) => fieldService.getAll(signal).then(r => r.data.fields) })
  const plant = useMutation({ mutationFn: data => cropService.plant(crop.id, data), onSuccess: async ({ data }) => {
    setRecord(data.farmerCrop)
    await invalidateFarm(client)
  } })
  const change = key => event => setValues(v => ({ ...v, [key]: event.target.value }))
  const estimate = harvestEstimate(values.plantedAt, crop.daysToHarvest)
  if (record) return <div className="space-y-4">
    <Message>{`${crop.name} has been added to your farm.`}</Message>
    <p className="text-sm">Planted on {new Date(record.plantedAt).toLocaleDateString(undefined, { timeZone: 'UTC' })}{record.field?.name ? ` in ${record.field.name}` : ', with no field assigned'}.</p>
    <div className="flex flex-wrap gap-4 text-sm font-semibold"><Link className="underline" to={`/my-crops?record=${record.id}`}>View my planting</Link><Link className="underline" to="/dashboard">Go to dashboard</Link>{record.fieldId && <Link className="underline" to={`/fields?field=${record.fieldId}`}>View field records</Link>}</div>
    <Button variant="secondary" onClick={() => { setRecord(null); plant.reset() }}>Record another planting</Button>
  </div>
  return <form onSubmit={event => {
    event.preventDefault(); setLocalError('')
    try {
      if (values.fieldId && !fields.data?.some(field => field.id === values.fieldId)) throw new Error('Select one of your fields, or choose no field.')
      plant.mutate(plantingPayload(values))
    } catch (error) { setLocalError(error.message) }
  }} className="space-y-4">
    <fieldset disabled={plant.isPending || fields.isPending || !!fields.error} className="space-y-4 min-w-0">
      <Input label="Planting date" type="date" required value={values.plantedAt} onChange={change('plantedAt')} />
      <Select label="Field" value={values.fieldId} onChange={change('fieldId')}><option value="">No field assigned</option>{fields.data?.map(field => <option key={field.id} value={field.id}>{field.name}</option>)}</Select>
      {fields.isPending ? <p role="status" className="text-sm">Loading your fields…</p> : !fields.error && fields.data.length === 0 && <p className="text-sm">You can plant without a field, or <Link to="/fields" className="underline">add a field first</Link>.</p>}
      <Input label="Quantity planted (optional)" type="number" min="0.000001" step="any" value={values.quantity} onChange={change('quantity')} helper="Enter the amount and describe its unit in your notes, such as 2 bags of seed." />
      <Textarea label="Planting notes" maxLength={5000} value={values.notes} onChange={change('notes')} />
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{estimate ? `Estimated harvest: ${estimate}. Actual timing depends on variety and growing conditions.` : 'This guide has no harvest duration. Your planting can still be saved without an estimated harvest date.'}</p>
    </fieldset>
    {fields.error && <div><Message error>Unable to load your fields. Try again before saving this planting.</Message><Button variant="secondary" onClick={() => fields.refetch()}>Retry fields</Button></div>}
    <Message error>{localError || (plant.error && apiErrorMessage(plant.error))}</Message>
    <Button type="submit" loading={plant.isPending} disabled={fields.isPending || !!fields.error}>Save planting</Button>
  </form>
}
