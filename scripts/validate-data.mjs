import { resolve } from 'node:path'
import { assertSnapshot, dataDir, readJson } from './data-utils.mjs'

try { assertSnapshot(readJson(resolve(dataDir, 'products.json'))); console.log('Data validation passed.') } catch (error) { console.error(error.message); process.exitCode = 1 }
