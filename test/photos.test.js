import { test } from 'node:test'
import assert from 'node:assert/strict'
import { photoError } from '../src/lib/photos.js'

test('photo selection rejects unsupported, empty and oversized files but accepts supported formats', () => {
  assert.match(photoError(null), /Select/)
  assert.match(photoError({ type: 'image/svg+xml', size: 100 }), /JPEG/)
  assert.match(photoError({ type: 'image/png', size: 0 }), /empty/)
  assert.match(photoError({ type: 'image/jpeg', size: 5 * 1024 * 1024 + 1 }), /too large/)
  for (const type of ['image/jpeg','image/png','image/webp']) assert.equal(photoError({ type, size: 5 * 1024 * 1024 }), '')
})
