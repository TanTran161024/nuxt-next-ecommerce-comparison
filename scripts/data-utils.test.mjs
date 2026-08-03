import assert from 'node:assert/strict'
import test from 'node:test'
import { assertSnapshot } from './data-utils.mjs'

test('assertSnapshot rejects a snapshot that does not contain 50 records', () => {
  assert.throws(() => assertSnapshot([]), /exactly 50 products/)
})
