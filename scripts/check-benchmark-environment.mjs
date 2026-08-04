import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { configPath, experimentRoot, isPlaceholder, readConfig, root, runCommand } from './experiment-utils.mjs'
import { lighthouseConfigurationErrors } from './lighthouse-benchmark-options.mjs'

const config = readConfig()
const checks = []
const add = (name, passed, detail) => checks.push({ name, passed, detail })
const version = async (command) => (await runCommand({ command })).stdout.trim()
const gitStatus = await runCommand({ command: 'git status --porcelain' })
const dirtyFiles = gitStatus.stdout.split(/\r?\n/).filter(Boolean).map((line) => line.slice(3))
const onlyExperimentalFiles = dirtyFiles.every((file) => file.replaceAll('\\', '/').startsWith('experimental-results/'))

add('Node.js', process.version === `v${config.nodeVersion}`, `required ${config.nodeVersion}; found ${process.version}`)
const npmVersion = await version('npm --version')
add('npm', npmVersion === config.npmVersion, `required ${config.npmVersion}; found ${npmVersion || 'not found'}`)
add('Git working tree', dirtyFiles.length === 0 || onlyExperimentalFiles, dirtyFiles.length === 0 ? 'clean' : `non-experimental changes: ${dirtyFiles.join(', ')}`)
for (const [framework, value] of Object.entries(config.frameworks)) {
  add(`${framework} dependencies`, existsSync(resolve(root, value.directory, 'node_modules')), existsSync(resolve(root, value.directory, 'node_modules')) ? 'node_modules present' : 'node_modules missing')
}
const products = JSON.parse(readFileSync(resolve(root, 'shared-data/products.json'), 'utf8'))
add('Benchmark product slug', products.some((product) => product.slug === config.productSlug), `${config.productSlug}`)
const chromeCommand = process.platform === 'win32'
  ? 'where chrome.exe || where chromium.exe || where msedge.exe'
  : 'command -v google-chrome || command -v chromium || command -v chromium-browser'
const chrome = await runCommand({ command: chromeCommand })
const localChrome = process.platform === 'win32' ? [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].find(existsSync) : undefined
add('Chrome/Chromium', chrome.exitCode === 0 || Boolean(localChrome), chrome.stdout.trim() || localChrome || 'not found')
const lighthouseCommand = process.platform === 'win32' ? 'where lighthouse.cmd || where lighthouse' : 'command -v lighthouse'
const lighthouse = await runCommand({ command: lighthouseCommand })
const localLighthouse = [
  resolve(root, 'node_modules/.bin/lighthouse.cmd'),
  resolve(root, 'nuxt-app/node_modules/.bin/lighthouse.cmd'),
  resolve(root, 'next-app/node_modules/.bin/lighthouse.cmd'),
].find(existsSync)
add('Lighthouse CLI', lighthouse.exitCode === 0 || Boolean(localLighthouse), lighthouse.stdout.trim() || localLighthouse || 'not found locally or on PATH; did not install')
const lighthousePlaceholders = Object.entries(config.lighthouse).filter(([, value]) => isPlaceholder(value)).map(([key]) => key)
const lighthouseErrors = lighthousePlaceholders.length ? [`requires confirmation: ${lighthousePlaceholders.join(', ')}`] : lighthouseConfigurationErrors(config.lighthouse)
add('Lighthouse configuration', lighthouseErrors.length === 0, lighthouseErrors.length ? lighthouseErrors.join('; ') : 'complete')
add('Benchmark config', existsSync(configPath), configPath)

const hardBlockers = checks.filter((check) => ['Node.js', 'npm', 'Git working tree'].includes(check.name) && !check.passed)
let validationRan = false
if (!hardBlockers.length) {
  validationRan = true
  const validationCommands = [
    ['Snapshot parity', 'npm run test:parity-snapshot', root],
    ['Nuxt lint', 'npm run lint', resolve(root, 'nuxt-app')],
    ['Next lint', 'npm run lint', resolve(root, 'next-app')],
    ['Nuxt typecheck', 'npm run typecheck', resolve(root, 'nuxt-app')],
    ['Next typecheck', 'npm run typecheck', resolve(root, 'next-app')],
    ['Nuxt tests', 'npm test', resolve(root, 'nuxt-app')],
    ['Next tests', 'npm test', resolve(root, 'next-app')],
    ['Nuxt production build trial', 'npm run build', resolve(root, 'nuxt-app')],
    ['Next production build trial', 'npm run build', resolve(root, 'next-app')],
  ]
  for (const [name, command, cwd] of validationCommands) {
    const result = await runCommand({ command, cwd })
    add(name, result.exitCode === 0, result.exitCode === 0 ? 'pass' : `failed (exit ${result.exitCode})`)
  }
} else {
  add('Validation commands', false, `not run because: ${hardBlockers.map((check) => check.name).join(', ')}`)
}

for (const check of checks) console.log(`${check.passed ? 'PASS' : 'BLOCKED'} | ${check.name} | ${check.detail}`)
const blockers = checks.filter((check) => !check.passed)
console.log(`\nPreflight ${blockers.length ? 'blocked' : 'passed'}; validation commands ${validationRan ? 'ran' : 'did not run'}.`)
process.exitCode = blockers.length ? 1 : 0
