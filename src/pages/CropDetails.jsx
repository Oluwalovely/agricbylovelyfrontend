import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import cropService from '../services/crop.service.js'
import CropImage from '../components/crops/CropImage.jsx'
import PlantCropForm from '../components/crops/PlantCropForm.jsx'
import Button from '../components/ui/Button.jsx'
import { Message } from '../components/farm/FarmForm.jsx'
import { panelStyle } from '../lib/farmSetup.js'
import { displayLabel } from '../lib/planting.js'
import { apiErrorMessage } from '../services/api.js'

const months = values => values?.length ? values.map(month => new Date(2026, month - 1, 1).toLocaleString(undefined, { month: 'short' })).join(', ') : 'Not recorded'
const list = values => values?.length ? values.map(displayLabel).join(', ') : 'Not recorded'

export default function CropDetails() {
  const { id } = useParams()
  const query = useQuery({ queryKey: ['crop', id], queryFn: ({ signal }) => cropService.getById(id, signal).then(r => r.data.crop), retry: (count, error) => error.response?.status !== 404 && error.response?.status !== 400 && count < 1 })
  if (query.isPending) return <p role="status">Loading the crop guide…</p>
  if (query.error) return <div className="space-y-3"><Message error>{apiErrorMessage(query.error)}</Message><Link className="underline" to="/crops">Back to Crop Encyclopedia</Link>{query.error.response?.status !== 404 && <Button onClick={() => query.refetch()}>Try again</Button>}</div>
  const crop = query.data
  const details = [
    ['Harvest duration', crop.daysToHarvest ? `About ${crop.daysToHarvest} days` : 'Not recorded'],
    ['Sunlight', displayLabel(crop.sunlight)],
    ['Suitable soils', list(crop.soilTypes)],
    ['Climate', crop.climateZone || 'Not recorded'],
    ['Planting depth', crop.plantingDepthCm == null ? 'Not recorded' : `${crop.plantingDepthCm} cm`],
    ['Plant spacing', crop.spacingCm == null ? 'Not recorded' : `${crop.spacingCm} cm`],
    ['Water per week', crop.waterNeedsMm == null ? 'Not recorded' : `${crop.waterNeedsMm} mm`],
    ['Planting months', months(crop.plantingMonths)],
    ['Harvest months', months(crop.harvestMonths)],
  ]
  return <div className="space-y-6">
    <Link to="/crops" className="text-sm underline underline-offset-4">Back to Crop Encyclopedia</Link>
    <header><h1 className="text-3xl mb-2 break-words">{crop.name}</h1><p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{displayLabel(crop.category)}{crop.botanicalName && ` · ${crop.botanicalName}`}</p></header>
    <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6 items-start">
      <section className="rounded-2xl overflow-hidden" style={panelStyle}>
        <CropImage key={crop.imageUrl || crop.id} crop={crop} className="h-56 sm:h-72" />
        <div className="p-5 sm:p-7 space-y-6"><div><h2 className="text-xl mb-3">Growing guide</h2><p className="text-sm leading-relaxed whitespace-pre-line">{crop.description || 'A growing description has not been recorded for this crop yet.'}</p></div>
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-4">{details.map(([label, value]) => <div key={label}><dt className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</dt><dd className="text-sm font-medium">{value}</dd></div>)}</dl>
          <div><h3 className="text-base mb-2">Companion plants</h3><p className="text-sm">{list(crop.companionPlants)}</p></div>
          <div><h3 className="text-base mb-2">Pests and diseases</h3><p className="text-sm">{list(crop.pestsAndDiseases)}</p></div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>This catalogue guide is general. Planting seasons and harvest timing vary by location, variety and conditions.</p>
        </div>
      </section>
      <section className="rounded-2xl p-5 sm:p-7" style={panelStyle}><h2 className="text-xl mb-2">Plant {crop.name}</h2><p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Record a planting date, field and any notes for this crop.</p><PlantCropForm key={crop.id} crop={crop} /></section>
    </div>
  </div>
}
