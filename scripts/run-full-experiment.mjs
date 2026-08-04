import { copyFileSync, existsSync, readFileSync, readdirSync, renameSync } from 'node:fs'
import { resolve } from 'node:path'
import { ensureDirectory, experimentRoot, now, readConfig, root, runCommand, writeText } from './experiment-utils.mjs'

const modes = ['--preflight', '--build-only', '--lighthouse-only', '--full', '--pilot', '--pilot-02']
const mode = process.argv.find((argument) => modes.includes(argument))
if (!mode) throw new Error(`Choose one mode: ${modes.join(', ')}. --full is never the default.`)
const run = async (command) => {
  const result = await runCommand({ command })
  process.stdout.write(result.stdout)
  process.stderr.write(result.stderr)
  if (result.exitCode !== 0) throw new Error(`Command failed: ${command}`)
  return result
}
const countFiles = (directory, extension) => existsSync(directory)
  ? readdirSync(directory, { recursive: true }).filter((file) => String(file).endsWith(extension)).length
  : 0
const csvRows = (path) => existsSync(path) ? Math.max(0, readFileSync(path, 'utf8').split(/\r?\n/).filter(Boolean).length - 1) : 0

if (mode === '--preflight') {
  const result = await runCommand({ command: 'node scripts/check-benchmark-environment.mjs' })
  process.stdout.write(result.stdout)
  process.stderr.write(result.stderr)
  process.exitCode = result.exitCode
}
if (mode === '--build-only') {
  await run('node scripts/check-benchmark-environment.mjs')
  await run('node scripts/run-build-benchmark.mjs')
}
if (mode === '--lighthouse-only') {
  await run('node scripts/check-benchmark-environment.mjs')
  await run('node scripts/run-lighthouse-benchmark.mjs')
}
if (mode === '--full') {
  await run('node scripts/check-benchmark-environment.mjs')
  await run('node scripts/run-build-benchmark.mjs')
  await run('node scripts/run-lighthouse-benchmark.mjs')
  await run('node scripts/run-functional-benchmark.mjs')
  await run('npm run experimental:summarize')
  await run('node scripts/summarize-build-results.mjs')
  writeText(resolve(experimentRoot, 'summary', 'experiment-status.md'), `# Experiment status\n\nCompleted at: ${now()}\n\nNo framework ranking is inferred by this tool.\n`)
}
if (mode === '--pilot' || mode === '--pilot-02') {
  const startedAt = now()
  const pilotName = mode === '--pilot-02' ? 'pilot-02' : 'pilot'
  const pilotArgument = mode
  const pilotRoot = resolve(experimentRoot, pilotName)
  const pilotReportPath = resolve(pilotRoot, 'pilot-report.md')
  const config = readConfig()
  const commit = (await runCommand({ command: 'git rev-parse HEAD' })).stdout.trim() || 'unavailable'
  const workingTree = (await runCommand({ command: 'git status --short' })).stdout.trim() || 'clean'
  for (const directory of ['environment', 'lighthouse/nuxt', 'lighthouse/next', 'build-logs', 'test-results', 'raw-data', 'summary']) ensureDirectory(resolve(pilotRoot, directory))
  if (existsSync(pilotReportPath)) renameSync(pilotReportPath, resolve(pilotRoot, `pilot-report-attempt-${Date.now()}.md`))
  const pilotCasesPath = resolve(pilotRoot, 'test-results/functional-test-cases.csv')
  if (!existsSync(pilotCasesPath)) copyFileSync(resolve(experimentRoot, 'test-results/functional-test-cases.csv'), pilotCasesPath)
  writeText(resolve(pilotRoot, 'environment', 'pilot-config.json'), `${JSON.stringify({ ...config, runsPerCase: 1 }, null, 2)}\n`)
  let preflight = 'FAIL'
  let pilotStatus = 'PILOT_FAILED'
  let failure = ''
  try {
    await run('node scripts/check-benchmark-environment.mjs')
    preflight = 'PASS'
    if (csvRows(resolve(pilotRoot, 'raw-data/build-results.csv')) === 0) {
      await run(`node scripts/run-build-benchmark.mjs ${pilotArgument}`)
    } else {
      console.log('Pilot build results already exist; retaining them and resuming with the failed Lighthouse step.')
    }
    await run(`node scripts/run-lighthouse-benchmark.mjs ${pilotArgument}`)
    await run(`node scripts/run-functional-benchmark.mjs ${pilotArgument}`)
    await run(`node scripts/summarize-experimental-results.mjs ${pilotArgument}`)
    await run(`node scripts/summarize-build-results.mjs ${pilotArgument}`)
    pilotStatus = 'PILOT_PASS_WITH_WARNINGS'
  } catch (error) {
    failure = error instanceof Error ? error.message : String(error)
  } finally {
    const lighthouseRows = csvRows(resolve(pilotRoot, 'raw-data/lighthouse-results.csv'))
    const buildRows = csvRows(resolve(pilotRoot, 'raw-data/build-results.csv'))
    const profilesRemaining = countFiles(pilotRoot, '.lighthouse-profile-')
    const report = [
      '# Pilot report', '',
      `- Status: **${pilotStatus}**`,
      `- Started: ${startedAt}`,
      `- Finished: ${now()}`,
      `- Commit SHA: ${commit}`,
      `- Working tree before pilot: ${workingTree}`,
      `- Node.js: ${process.version}`,
      `- Lighthouse configuration: ${JSON.stringify(config.lighthouse)}`,
      `- Preflight: ${preflight}`,
      `- Build CSV rows: ${buildRows}`,
      `- Lighthouse CSV rows: ${lighthouseRows}`,
      `- Lighthouse JSON reports: ${countFiles(resolve(pilotRoot, 'lighthouse'), '.json')}`,
      `- Lighthouse HTML reports: ${countFiles(resolve(pilotRoot, 'lighthouse'), '.html')}`,
      `- Temporary Chrome profiles remaining: ${profilesRemaining}`,
      '- Manual review: FT-11 Loading, FT-12 Error, FT-14 Responsive.',
      '- Pilot results are isolated and must not be used to rank frameworks.',
      failure ? `- Failure: ${failure}` : '- Failure: none', '',
    ].join('\n')
    writeText(pilotReportPath, report)
    console.log(`Pilot report: ${pilotReportPath}`)
  }
  if (pilotStatus === 'PILOT_FAILED') process.exitCode = 1
}
