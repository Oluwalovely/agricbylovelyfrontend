import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calendarEntries, monthDates, selectedMonth } from '../src/lib/farmReports.js'
test('calendar grids place Sunday first and include leap day and month-end dates', () => {
  const february = monthDates(2024, 2)
  assert.equal(february.filter(Boolean).length, 29)
  assert.equal(february[4], '2024-02-01')
  assert.equal(february.at(-1), '2024-02-29')
  assert.equal(monthDates(2026, 12).at(-1), '2026-12-31')
})
test('invalid URL months/years fall back to today and valid values survive reload', () => {
  assert.deepEqual(selectedMonth(new URLSearchParams('month=13&year=2026'), '2026-10-07'), { year: 2026, month: 10 })
  assert.deepEqual(selectedMonth(new URLSearchParams('month=12&year=2025')), { year: 2025, month: 12 })
})
test('month entries separate estimates from actual harvest and exclude dates outside the view', () => {
  const events = [
    { id: 'one', cropName: 'Maize', planting: { date: '2026-09-01' }, harvest: { date: '2026-10-07', isHarvested: true } },
    { id: 'two', cropName: 'Beans', planting: { date: '2026-10-01' }, harvest: { date: '2026-11-01', isHarvested: false } },
    { id: 'three', cropName: 'Yam', planting: { date: '2026-08-01' }, harvest: { date: '2026-10-10', isHarvested: false } },
  ]
  const entries = calendarEntries(events, 2026, 10)
  assert.deepEqual(entries.map(event => [event.date, event.kind]), [['2026-10-01', 'Planted'], ['2026-10-07', 'Harvested'], ['2026-10-10', 'Estimated harvest']])
  assert.equal(entries[1].recordId, 'one')
})
