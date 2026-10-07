import { plantingPayload } from './planting.js'
export const activeStages = ['GERMINATING', 'SEEDLING', 'GROWING', 'FLOWERING', 'MATURING', 'READY']
export function harvestPayload(values, plantedAt, today = new Date().toISOString().slice(0, 10)) {
  const date = plantingPayload({ plantedAt: values.harvestedAt, fieldId: '', notes: '', quantity: '' }).plantedAt
  if (date < new Date(plantedAt).toISOString().slice(0, 10)) throw new Error('Harvest date cannot be before the planting date.')
  if (date > today) throw new Error('Harvest date cannot be in the future.')
  const yieldKg = values.yieldKg === '' ? null : Number(values.yieldKg)
  if (yieldKg !== null && (!Number.isFinite(yieldKg) || yieldKg < 0)) throw new Error('Yield must be zero or greater, or left blank.')
  return { stage: 'HARVESTED', harvestedAt: date, yieldKg, notes: values.notes.trim() }
}
