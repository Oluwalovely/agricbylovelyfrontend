import assert from 'node:assert/strict'
import { test } from 'node:test'
import { localDate, plantingPayload, harvestEstimate } from '../src/lib/planting.js'

test('planting preserves the calendar date, owned field, notes and numeric quantity', () => {
  assert.deepEqual(plantingPayload({ plantedAt: '2026-10-07', fieldId: 'plot', notes: ' 2 bags ', quantity: '2' }), { plantedAt: '2026-10-07', fieldId: 'plot', notes: '2 bags', quantity: 2 })
  assert.deepEqual(plantingPayload({ plantedAt: '2026-10-07', fieldId: '', notes: '', quantity: '' }), { plantedAt: '2026-10-07', fieldId: null, notes: '' })
})
test('invalid dates and nonpositive quantities cannot submit', () => {
  for (const plantedAt of ['', '2026-02-30', 'wrong']) assert.throws(() => plantingPayload({ plantedAt, fieldId: '', notes: '', quantity: '' }))
  for (const quantity of ['0', '-2', 'NaN']) assert.throws(() => plantingPayload({ plantedAt: '2026-10-07', fieldId: '', notes: '', quantity }))
})
test('harvest estimates cross month/year boundaries and unknown durations remain unknown', () => {
  assert.match(harvestEstimate('2026-12-31', 2), /2027/)
  assert.equal(harvestEstimate('2026-10-07', null), null)
  assert.equal(localDate(new Date(2026, 9, 7, 23, 59)), '2026-10-07')
})
