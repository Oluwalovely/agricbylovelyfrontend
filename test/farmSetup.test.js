import assert from 'node:assert/strict'
import { test } from 'node:test'
import { farmPayload, needsFarmSetup } from '../src/lib/farmSetup.js'

test('optional sizes and locations clear explicitly while zero coordinates survive', () => {
  assert.deepEqual(farmPayload({ name: 'North plot', sizeHa: '', latitude: '', longitude: '' }), { name: 'North plot', sizeHa: null, latitude: null, longitude: null })
  assert.deepEqual(farmPayload({ farmSizeHa: '2.5', latitude: '0', longitude: '0' }, 'profile'), { farmSizeHa: 2.5, latitude: 0, longitude: 0 })
})
test('invalid sizes and incomplete or out-of-range locations never submit', () => {
  for (const values of [ { sizeHa: '-1', latitude: '', longitude: '' }, { sizeHa: '', latitude: '1', longitude: '' }, { sizeHa: '', latitude: '91', longitude: '0' } ]) assert.throws(() => farmPayload(values))
})
test('farm setup uses missing saved details, including older accounts', () => {
  assert.equal(needsFarmSetup({ createdAt: '2020-01-01', state: 'Ogun' }, []), true)
  assert.equal(needsFarmSetup({ state: 'Ogun' }, [{ id: 'plot' }]), false)
  assert.equal(needsFarmSetup({ latitude: 0, longitude: 0 }, [{ id: 'plot' }]), false)
  assert.equal(needsFarmSetup({}, [{ id: 'plot' }]), true)
})
