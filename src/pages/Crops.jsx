import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import Input from '../components/ui/Input.jsx'
import Select from '../components/ui/Select.jsx'
import Button from '../components/ui/Button.jsx'
import CropImage from '../components/crops/CropImage.jsx'
import { Message } from '../components/farm/FarmForm.jsx'
import { panelStyle } from '../lib/farmSetup.js'
import { cropCategories, displayLabel } from '../lib/planting.js'
import cropService from '../services/crop.service.js'
import { apiErrorMessage } from '../services/api.js'

export default function Crops() {
  const [params, setParams] = useSearchParams()
  const q = (params.get('q') || '').slice(0, 200)
  const fieldId = params.get('field') || ''
  const detailLink = id => `/crops/${id}${fieldId ? `?field=${encodeURIComponent(fieldId)}` : ''}`
  const category = cropCategories.includes(params.get('category')) ? params.get('category') : ''
  const rawPage = Number(params.get('page'))
  const page = Number.isInteger(rawPage) && rawPage > 0 && rawPage <= 1000000 ? rawPage : 1
  const [search, setSearch] = useState(q)
  const [previousQ, setPreviousQ] = useState(q)
  if (previousQ !== q) { setPreviousQ(q); setSearch(q) }
  const update = (values) => setParams(Object.fromEntries(Object.entries({ q, category, field: fieldId, page: 1, ...values }).filter(([, value]) => value !== '' && value !== 1)))
  const query = useQuery({ queryKey: ['crops', q, category, page], queryFn: ({ signal }) => cropService.getAll({ q: q || undefined, category: category || undefined, page, limit: 12 }, signal).then(r => r.data) })
  return <div className="space-y-6">
    <header><h1 className="text-3xl mb-2">Crop Encyclopedia</h1><p style={{ color: 'var(--text-secondary)' }}>Explore growing guides and choose what to plant on your farm.</p></header>
    <form className="rounded-2xl p-5 flex flex-wrap items-end gap-4" style={panelStyle} onSubmit={e => { e.preventDefault(); update({ q: search.trim() }) }}>
      <div className="flex-1 min-w-0 basis-64"><Input label="Search crops" maxLength={200} placeholder="Name, botanical name or growing guide" value={search} onChange={e => setSearch(e.target.value)} /></div>
      <div className="w-full sm:w-48"><Select label="Category" value={category} onChange={e => update({ category: e.target.value })}><option value="">All categories</option>{cropCategories.map(value => <option key={value} value={value}>{displayLabel(value)}</option>)}</Select></div>
      <Button type="submit">Search</Button>{(q || category) && <Button variant="ghost" onClick={() => { setSearch(''); setParams({}) }}>Clear filters</Button>}
    </form>
    {query.isPending ? <p role="status">Loading crop guides…</p> : query.error ? <div><Message error>{apiErrorMessage(query.error)}</Message><Button onClick={() => query.refetch()}>Try again</Button></div> : <>
      <p className="text-sm" role="status" style={{ color: 'var(--text-secondary)' }}>{query.data.total} {query.data.total === 1 ? 'crop' : 'crops'} found{q && ` for “${q}”`}</p>
      {query.data.crops.length === 0 ? <section className="rounded-2xl p-7" style={panelStyle}><h2 className="text-xl mb-2">No matching crops</h2><p>Try another name or clear your filters to browse the saved catalogue.</p><Button className="mt-4" variant="secondary" onClick={() => { setSearch(''); setParams({}) }}>Browse all crops</Button></section> : <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">{query.data.crops.map(crop => <article key={crop.id} className="rounded-2xl overflow-hidden" style={panelStyle}>
        <CropImage key={crop.imageUrl || crop.id} crop={crop} className="h-40" />
        <div className="p-5"><p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{displayLabel(crop.category)}</p><h2 className="text-xl mb-1 break-words"><Link to={detailLink(crop.id)} className="hover:underline focus-visible:outline-2">{crop.name}</Link></h2><p className="text-sm italic mb-3" style={{ color: 'var(--text-secondary)' }}>{crop.botanicalName || 'Botanical name not recorded'}</p><p className="text-sm mb-4">{crop.daysToHarvest ? `About ${crop.daysToHarvest} days to harvest` : 'Harvest timing not recorded'}</p><Link to={detailLink(crop.id)} className="text-sm font-semibold underline underline-offset-4" style={{ color: 'var(--green-dark)' }}>View guide & plant</Link></div>
      </article>)}</div>}
      {query.data.pages > 1 && <nav aria-label="Crop pages" className="flex flex-wrap justify-center items-center gap-4"><Button variant="secondary" disabled={page <= 1} onClick={() => update({ page: page - 1 })}>Previous</Button><span className="text-sm">Page {page} of {query.data.pages}</span><Button variant="secondary" disabled={page >= query.data.pages} onClick={() => update({ page: page + 1 })}>Next</Button></nav>}
    </>}
  </div>
}
