import assert from 'node:assert/strict'
import { test } from 'node:test'
import { harvestPayload } from '../src/lib/cropLifecycle.js'
test('harvest includes stage/date and distinguishes zero yield from unknown', () => {
  const base = { harvestedAt: '2026-10-07', notes: ' Finished ', yieldKg: '0' }
  assert.deepEqual(harvestPayload(base, '2026-09-01', '2026-10-07'), { stage: 'HARVESTED', harvestedAt: '2026-10-07', notes: 'Finished', yieldKg: 0 })
  assert.equal(harvestPayload({ ...base, yieldKg: '' }, '2026-09-01', '2026-10-07').yieldKg, null)
})
test('harvest rejects invalid dates, dates outside the planting interval and invalid yields', () => {
  const base = { harvestedAt: '2026-10-07', yieldKg: '5', notes: '' }
  for (const harvestedAt of ['2026-02-30', '2026-08-31', '2026-10-08']) assert.throws(() => harvestPayload({ ...base, harvestedAt }, '2026-09-01', '2026-10-07'))
  for (const yieldKg of ['-1', 'wrong']) assert.throws(() => harvestPayload({ ...base, yieldKg }, '2026-09-01', '2026-10-07'))
})
