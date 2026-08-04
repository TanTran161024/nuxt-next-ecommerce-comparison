import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { appendCsv, ensureDirectory, experimentRoot, now, readConfig, root, runCommand, writeText } from './experiment-utils.mjs'

const config = readConfig()
const headers = ['framework', 'run', 'build_time_seconds', 'success', 'warnings', 'node_version', 'framework_version', 'measured_at', 'notes']
const resultPath = resolve(experimentRoot, 'raw-data/build-results.csv')
const frameworkVersion = (framework) => framework === 'nuxt' ? '4.5.1' : '16.2.12'

for (let run = 1; run <= config.runsPerCase; run += 1) {
  for (const framework of ['nuxt', 'next']) {
    const item = config.frameworks[framework]
    const directory = resolve(root, item.directory)
    const generatedDirectories = framework === 'nuxt' ? ['.nuxt', '.output'] : ['.next']
    for (const generated of generatedDirectories) rmSync(resolve(directory, generated), { recursive: true, force: true })
    const startedAt = process.hrtime.bigint()
    const execution = await runCommand({ command: item.buildCommand, cwd: directory })
    const seconds = Number(process.hrtime.bigint() - startedAt) / 1e9
    const logPath = resolve(experimentRoot, 'build-logs', `${framework}-run-${String(run).padStart(2, '0')}.log`)
    ensureDirectory(resolve(experimentRoot, 'build-logs'))
    writeText(logPath, `${execution.stdout}${execution.stderr}`)
    appendCsv(resultPath, headers, {
      framework,
      run,
      build_time_seconds: execution.exitCode === 0 ? seconds : '',
      success: execution.exitCode === 0,
      warnings: (execution.stdout + execution.stderr).match(/warning/gi)?.length ?? 0,
      node_version: process.version,
      framework_version: frameworkVersion(framework),
      measured_at: now(),
      notes: execution.exitCode === 0 ? '' : `Build failed; see ${logPath}`,
    })
    console.log(`${framework} run ${run}: ${execution.exitCode === 0 ? 'success' : 'failed'} (${seconds.toFixed(3)}s)`)
  }
}
