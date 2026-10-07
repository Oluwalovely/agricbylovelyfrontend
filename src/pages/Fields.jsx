import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import FarmForm, { Message } from '../components/farm/FarmForm.jsx'
import Button from '../components/ui/Button.jsx'
import fieldService from '../services/field.service.js'
import useAuthStore from '../store/authStore.js'
import { apiErrorMessage } from '../services/api.js'
import { invalidateFarm, soilLabel, panelStyle } from '../lib/farmSetup.js'

function FieldDetails({ id, farmerId, onClose }) {
  const query = useQuery({ queryKey: ['field', farmerId, id], queryFn: ({ signal }) => fieldService.getById(id, signal).then(r => r.data.field) })
  return <section className="rounded-2xl p-5 sm:p-7" style={panelStyle}>
    <div className="flex justify-between gap-4 mb-4"><h2 className="text-xl">{query.data?.name || 'Field details'}</h2><Button variant="ghost" onClick={onClose}>Close details</Button></div>
    {query.isPending ? <p role="status">Loading field records...</p> : query.error ? <div><Message error>{apiErrorMessage(query.error)}</Message><Button onClick={() => query.refetch()}>Try again</Button></div> : <>
      <p className="text-sm mb-3">{query.data.notes || 'No field notes yet.'}</p>
      <div className="flex flex-wrap gap-4 text-sm mb-4"><Link className="underline" to={`/crops?field=${id}`}>Plant a crop in this field</Link><Link className="underline" to={`/my-crops?field=${id}&status=all`}>View field plantings</Link></div><h3 className="text-base mb-3">Planting records</h3>
      {query.data.farmerCrops.length ? <ul>{query.data.farmerCrops.map(record => <li key={record.id} className="py-3 flex flex-wrap justify-between gap-2 border-b" style={{ borderColor: 'var(--border)' }}><Link className="underline" to={`/my-crops?record=${record.id}&status=all`}>{record.crop.name}</Link><span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{record.harvestedAt ? 'Harvested' : soilLabel(record.stage)} · Planted {new Date(record.plantedAt).toLocaleDateString()}</span></li>)}</ul> : <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No crops have been assigned to this field yet.</p>}
    </>}
  </section>
}

export default function Fields() {
  const [params] = useSearchParams()
  const farmer = useAuthStore(s => s.farmer)
  const client = useQueryClient()
  const [editor, setEditor] = useState(null)
  const [selected, setSelected] = useState(params.get('field'))
  const [deleting, setDeleting] = useState(null)
  const [notice, setNotice] = useState('')
  const query = useQuery({ queryKey: ['fields', farmer.id], queryFn: ({ signal }) => fieldService.getAll(signal).then(r => r.data.fields) })
  const save = useMutation({ mutationFn: data => editor.id ? fieldService.update(editor.id, data) : fieldService.create(data), onSuccess: async () => { setEditor(null); setNotice('Field saved.'); await invalidateFarm(client) } })
  const remove = useMutation({ mutationFn: fieldService.remove, onSuccess: async () => { if (selected === deleting.id) setSelected(null); setDeleting(null); setNotice('Field deleted. Its planting records have been kept without a field assigned.'); await invalidateFarm(client) } })
  const fields = query.data || []
  return <div className="space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl mb-2">Your fields</h1><p style={{ color: 'var(--text-secondary)' }}>Organise the areas where you grow your crops.</p></div><Button disabled={!!editor} onClick={() => { save.reset(); setEditor({}); setNotice('') }}>Add field</Button></header>
    <Message>{notice}</Message>
    {editor && <section className="rounded-2xl p-5 sm:p-7 max-w-3xl" style={panelStyle}><h2 className="text-xl mb-5">{editor.id ? `Edit ${editor.name}` : 'Add a field'}</h2><FarmForm key={editor.id || 'new'} initial={editor} onSave={data => save.mutate(data)} pending={save.isPending} error={save.error && apiErrorMessage(save.error)} onCancel={() => setEditor(null)} /></section>}
    {query.isPending ? <p role="status">Loading your fields...</p> : query.error ? <div role="alert"><p>Unable to load your fields.</p><Button onClick={() => query.refetch()}>Try again</Button></div> : <>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{fields.length} {fields.length === 1 ? 'field' : 'fields'} · {fields.reduce((sum, field) => sum + (field.sizeHa || 0), 0).toLocaleString()} hectares recorded</p>
      <section className="rounded-2xl overflow-hidden" style={panelStyle}>
        {fields.length === 0 ? <div className="p-7"><h2 className="text-xl mb-2">Give your first field a name</h2><p style={{ color: 'var(--text-secondary)' }}>A field can be a plot, garden or growing area. Add its size and soil type when you know them.</p></div> : fields.map(field => <article key={field.id} className="p-5 sm:p-6 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-wrap justify-between gap-4"><div className="min-w-0"><h2 className="text-xl mb-2 break-words">{field.name}</h2><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{field.sizeHa == null ? 'Size not recorded' : `${field.sizeHa} ha`} · {soilLabel(field.soilType)} soil · {field.farmerCrops.length} active plantings</p>{field.notes && <p className="text-sm mt-2 break-words">{field.notes}</p>}</div>
          <div className="flex flex-wrap gap-2 items-start"><Button variant="secondary" size="sm" onClick={() => setSelected(field.id)}>View records</Button><Button variant="ghost" size="sm" disabled={!!editor} onClick={() => { save.reset(); setEditor(field) }}>Edit</Button><Button variant="ghost" size="sm" disabled={remove.isPending} onClick={() => { remove.reset(); setDeleting(field) }}>Delete</Button></div></div>
          {deleting?.id === field.id && <div className="mt-4 space-y-3"><p className="text-sm">Delete {field.name}? Its crops and harvest history will remain, with no field assigned.</p><Message error>{remove.error && apiErrorMessage(remove.error)}</Message><div className="flex flex-wrap gap-3"><Button variant="danger" loading={remove.isPending} onClick={() => remove.mutate(field.id)}>Confirm field deletion</Button><Button variant="ghost" disabled={remove.isPending} onClick={() => setDeleting(null)}>Keep field</Button></div></div>}
        </article>)}
      </section>
    </>}
    {selected && <FieldDetails key={selected} id={selected} farmerId={farmer.id} onClose={() => setSelected(null)} />}
  </div>
}
