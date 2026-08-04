import { experimentRoot, now, runCommand, writeText } from './experiment-utils.mjs'
import { resolve } from 'node:path'

const mode = process.argv.find((argument) => ['--preflight', '--build-only', '--lighthouse-only', '--full'].includes(argument))
if (!mode) throw new Error('Choose one mode: --preflight, --build-only, --lighthouse-only, or --full. --full is never the default.')
const run = async (command) => {
  const result = await runCommand({ command })
  if (result.exitCode !== 0) throw new Error(`Command failed: ${command}\n${result.stdout}${result.stderr}`)
  return result
}
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
