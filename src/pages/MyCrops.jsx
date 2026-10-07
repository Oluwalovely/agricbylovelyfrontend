import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import cropService from '../services/crop.service.js'
import useAuthStore from '../store/authStore.js'
import Button from '../components/ui/Button.jsx'
import { Message } from '../components/farm/FarmForm.jsx'
import { panelStyle } from '../lib/farmSetup.js'
import { displayLabel } from '../lib/planting.js'
import { apiErrorMessage } from '../services/api.js'

const dateLabel = value => value ? new Date(value).toLocaleDateString(undefined, { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' }) : 'Not recorded'

export default function MyCrops() {
  const farmer = useAuthStore(s => s.farmer)
  const [params, setParams] = useSearchParams()
  const query = useQuery({ queryKey: ['my-crops', farmer.id], queryFn: ({ signal }) => cropService.getMyCrops(signal).then(r => r.data.farmerCrops) })
  const status = params.get('status') || 'active'
  const fieldId = params.get('field')
  const records = (query.data || []).filter(record => (!fieldId || record.fieldId === fieldId) && (status === 'all' || (status === 'harvested' ? !!record.harvestedAt : !record.harvestedAt)))
  const selectStatus = value => { const next = new URLSearchParams(params); next.set('status', value); setParams(next) }
  return <div className="space-y-6">
    <header className="flex flex-wrap justify-between gap-4"><div><h1 className="text-3xl mb-2">My Crops</h1><p style={{ color: 'var(--text-secondary)' }}>Your saved plantings, field assignments and harvest estimates.</p></div><Link to="/crops" className="self-start rounded-full px-5 py-2.5 text-sm font-semibold text-white" style={{ background: 'var(--green-dark)' }}>Add a planting</Link></header>
    <div className="flex flex-wrap gap-3" role="group" aria-label="Planting status">{[['active', 'Active'], ['harvested', 'Harvested'], ['all', 'All plantings']].map(([value, label]) => <Button key={value} variant={status === value ? 'primary' : 'secondary'} onClick={() => selectStatus(value)}>{label}</Button>)}{fieldId && <Button variant="ghost" onClick={() => { const next = new URLSearchParams(params); next.delete('field'); setParams(next) }}>Clear field filter</Button>}</div>
    {query.isPending ? <p role="status">Loading your plantings…</p> : query.error ? <div><Message error>{apiErrorMessage(query.error)}</Message><Button onClick={() => query.refetch()}>Try again</Button></div> : <section className="rounded-2xl overflow-hidden" style={panelStyle}>
      {records.length === 0 ? <div className="p-7"><h2 className="text-xl mb-2">No {status === 'harvested' ? 'harvested' : status === 'all' ? '' : 'active'} plantings{fieldId && ' in this field'}</h2><p className="text-sm">Choose a crop from the Encyclopedia to record a planting.</p><Link to="/crops" className="text-sm underline inline-block mt-4">Browse crops</Link></div> : records.map(record => <article key={record.id} id={`planting-${record.id}`} className="p-5 sm:p-6 border-b last:border-b-0" style={{ borderColor: 'var(--border)', background: params.get('record') === record.id ? 'var(--bg-tertiary)' : undefined }}>
        <div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-xl mb-1"><Link to={`/crops/${record.cropId}`} className="hover:underline">{record.crop.name}</Link></h2><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{record.field ? <Link className="underline" to={`/fields?field=${record.fieldId}`}>{record.field.name}</Link> : 'No field assigned'} · {displayLabel(record.stage)}</p></div><Link to={`/crops/${record.cropId}`} className="text-sm underline">View growing guide</Link></div>
        <dl className="grid sm:grid-cols-3 gap-4 mt-5"><div><dt className="text-xs" style={{ color: 'var(--text-secondary)' }}>Planted</dt><dd className="text-sm">{dateLabel(record.plantedAt)}</dd></div><div><dt className="text-xs" style={{ color: 'var(--text-secondary)' }}>{record.harvestedAt ? 'Harvested' : 'Estimated harvest'}</dt><dd className="text-sm">{dateLabel(record.harvestedAt || record.expectedHarvestAt)}</dd></div><div><dt className="text-xs" style={{ color: 'var(--text-secondary)' }}>Quantity planted</dt><dd className="text-sm">{record.quantity ?? 'Not recorded'}</dd></div></dl>
        {record.notes && <p className="text-sm mt-4 whitespace-pre-line break-words">{record.notes}</p>}
      </article>)}
    </section>}
  </div>
}
