export const utcToday = () => new Date().toISOString().slice(0, 10)
export const formatDate = value => value ? new Date(value.length === 10 ? `${value}T00:00:00Z` : value).toLocaleDateString(undefined, { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' }) : 'Not recorded'
export const numberLabel = value => Number(value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })
export function selectedMonth(params, today = utcToday()) {
  const month = Number(params.get('month')), year = Number(params.get('year'))
  return month >= 1 && month <= 12 && Number.isInteger(month) && year >= 1900 && year <= 2100 && Number.isInteger(year)
    ? { month, year } : { month: Number(today.slice(5, 7)), year: Number(today.slice(0, 4)) }
}
export function monthDates(year, month) {
  const first = new Date(Date.UTC(year, month - 1, 1))
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return [...Array(first.getUTCDay()).fill(null), ...Array.from({ length: days }, (_, day) => `${year}-${String(month).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`)]
}
export function calendarEntries(events, year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`
  return events.flatMap(event => [
    { id: `${event.id}-plant`, recordId: event.id, name: event.cropName, date: event.planting.date, kind: 'Planted', field: event.fieldName },
    ...(event.harvest ? [{ id: `${event.id}-harvest`, recordId: event.id, name: event.cropName, date: event.harvest.date, kind: event.harvest.isHarvested ? 'Harvested' : 'Estimated harvest', field: event.fieldName }] : []),
  ]).filter(event => event.date.startsWith(prefix)).sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name))
}
