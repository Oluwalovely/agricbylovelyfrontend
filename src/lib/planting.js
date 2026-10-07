export const cropCategories = ['VEGETABLE', 'GRAIN', 'FRUIT', 'FLOWER', 'HERB', 'TUBER', 'LEGUME']
export const displayLabel = value => value ? value.toLowerCase().replaceAll('_', ' ').replace(/^./, c => c.toUpperCase()) : 'Not recorded'
export function localDate(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
export function plantingPayload(values) {
  const plantedAt = values.plantedAt
  const parsed = new Date(`${plantedAt}T00:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(plantedAt) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== plantedAt) throw new Error('Choose a valid planting date.')
  const quantity = values.quantity === '' ? undefined : Number(values.quantity)
  if (quantity !== undefined && (!Number.isFinite(quantity) || quantity <= 0)) throw new Error('Quantity must be greater than zero, or left blank.')
  return { plantedAt, fieldId: values.fieldId || null, notes: values.notes.trim(), ...(quantity !== undefined ? { quantity } : {}) }
}
export function harvestEstimate(plantedAt, days) {
  if (!days || !plantedAt) return null
  const date = new Date(`${plantedAt}T00:00:00Z`)
  if (!Number.isFinite(date.getTime())) return null
  date.setUTCDate(date.getUTCDate() + days)
  return date.toLocaleDateString(undefined, { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' })
}
