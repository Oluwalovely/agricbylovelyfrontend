import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import Textarea from '../ui/Textarea.jsx'
import Button from '../ui/Button.jsx'
import { Message } from '../farm/FarmForm.jsx'
import cropService from '../../services/crop.service.js'
import { apiErrorMessage } from '../../services/api.js'
import { invalidateFarm } from '../../lib/farmSetup.js'
import { activeStages, harvestPayload } from '../../lib/cropLifecycle.js'
import { displayLabel } from '../../lib/planting.js'

function RecordEditor({ record, mode, onCancel, onSaved }) {
  const client = useQueryClient()
  const today = new Date().toISOString().slice(0, 10)
  const [values, setValues] = useState({ stage: activeStages.includes(record.stage) ? record.stage : 'READY', notes: record.notes || '', harvestedAt: record.harvestedAt?.slice(0, 10) || today, yieldKg: record.yieldKg ?? '' })
  const [localError, setLocalError] = useState('')
  const harvest = mode === 'harvest'
  const save = useMutation({ mutationFn: data => cropService.updateMyCrop(record.id, data), onSuccess: async () => { onSaved(harvest ? 'Harvest saved. This planting is now in harvest history.' : 'Planting updated.', harvest); await invalidateFarm(client) } })
  const change = key => e => setValues(v => ({ ...v, [key]: e.target.value }))
  return <form className="mt-5 pt-5 border-t space-y-4 max-w-2xl" style={{ borderColor: 'var(--border)' }} onSubmit={e => {
    e.preventDefault(); setLocalError('')
    try { save.mutate(harvest ? harvestPayload(values, record.plantedAt) : { stage: values.stage, notes: values.notes.trim() }) } catch (error) { setLocalError(error.message) }
  }}>
    <h3 className="text-lg">{harvest ? record.harvestedAt ? 'Correct harvest details' : 'Record harvest' : 'Update growth stage and notes'}</h3>
    <fieldset disabled={save.isPending} className="space-y-4 min-w-0">
      {harvest ? <><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Saving marks this planting as harvested and removes it from active crops. Start a new planting for the next growing cycle.</p><div className="grid sm:grid-cols-2 gap-4"><Input id={`harvest-date-${record.id}`} label="Harvest date" type="date" required min={record.plantedAt.slice(0, 10)} max={today} value={values.harvestedAt} onChange={change('harvestedAt')} /><Input id={`yield-${record.id}`} label="Yield (kg)" type="number" min="0" step="any" value={values.yieldKg} onChange={change('yieldKg')} helper="Leave blank if unknown. Enter 0 for a recorded zero yield." /></div></> : <Select id={`stage-${record.id}`} label="Growth stage" value={values.stage} onChange={change('stage')}>{activeStages.map(stage => <option key={stage} value={stage}>{displayLabel(stage)}</option>)}</Select>}
      <Textarea id={`notes-${record.id}`} label="Planting notes" maxLength={5000} value={values.notes} onChange={change('notes')} />
    </fieldset>
    <Message error>{localError || (save.error && apiErrorMessage(save.error))}</Message>
    <div className="flex flex-wrap gap-3"><Button type="submit" loading={save.isPending}>{harvest ? 'Save harvest' : 'Save changes'}</Button><Button variant="ghost" disabled={save.isPending} onClick={onCancel}>Cancel</Button></div>
  </form>
}

export default function PlantingActions({ record, onUpdated }) {
  const client = useQueryClient()
  const [mode, setMode] = useState(null)
  const remove = useMutation({ mutationFn: () => cropService.removeMyCrop(record.id), onSuccess: async () => { onUpdated('Planting removed. Totals have been refreshed.', false); await invalidateFarm(client) } })
  if (mode === 'delete') return <div className="mt-5 space-y-3" role="group" aria-label="Confirm planting removal"><p className="text-sm">Permanently remove this {record.crop.name} planting? Its notes, harvest and yield will also be removed from your totals. The crop guide and field will remain.</p><Message error>{remove.error && apiErrorMessage(remove.error)}</Message><div className="flex flex-wrap gap-3"><Button variant="danger" loading={remove.isPending} onClick={() => remove.mutate()}>Confirm removal</Button><Button variant="ghost" disabled={remove.isPending} onClick={() => setMode(null)}>Keep planting</Button></div></div>
  if (mode) return <RecordEditor key={`${record.id}-${mode}`} record={record} mode={mode} onCancel={() => setMode(null)} onSaved={(message, harvest) => { setMode(null); onUpdated(message, harvest) }} />
  return <div className="flex flex-wrap gap-3 mt-5">
    {!record.harvestedAt && <Button variant="secondary" onClick={() => setMode('edit')}>Update stage & notes</Button>}
    <Button variant={record.harvestedAt ? 'secondary' : 'primary'} onClick={() => setMode('harvest')}>{record.harvestedAt ? 'Edit harvest details' : 'Record harvest'}</Button>
    <Button variant="ghost" onClick={() => { remove.reset(); setMode('delete') }}>Remove planting</Button>
  </div>
}
