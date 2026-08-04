import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { experimentRoot, parseCsvLine } from './experiment-utils.mjs'

const input = resolve(experimentRoot, 'raw-data/build-results.csv')
const output = resolve(experimentRoot, 'summary/build-summary.csv')
if (!existsSync(input)) {
  console.error(`No real build CSV found at ${input}. No build summary was created.`)
  process.exitCode = 1
} else {
  const lines = readFileSync(input, 'utf8').split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) {
    console.error(`No measured rows found in ${input}. No build summary was created.`)
    process.exitCode = 1
  } else {
    const headers = parseCsvLine(lines[0])
    const rows = lines.slice(1).map((line) => Object.fromEntries(headers.map((header, index) => [header, parseCsvLine(line)[index] ?? ''])))
    const groups = new Map()
    for (const row of rows) groups.set(row.framework, [...(groups.get(row.framework) ?? []), row])
    const summary = [['framework', 'recorded_runs', 'successful_runs', 'failed_runs', 'build_time_mean_seconds', 'build_time_sample_stddev_seconds', 'build_time_median_seconds', 'build_time_min_seconds', 'build_time_max_seconds']]
    for (const [framework, group] of groups) {
      const values = group.filter((row) => row.success === 'true').map((row) => Number(row.build_time_seconds)).filter(Number.isFinite)
      const mean = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : ''
      const variance = values.length > 1 ? values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1) : 0
      const ordered = [...values].sort((left, right) => left - right)
      const median = values.length ? (ordered.length % 2 ? ordered[Math.floor(ordered.length / 2)] : (ordered[ordered.length / 2 - 1] + ordered[ordered.length / 2]) / 2) : ''
      summary.push([framework, group.length, values.length, group.length - values.length, mean, values.length ? Math.sqrt(variance) : '', median, values.length ? ordered[0] : '', values.length ? ordered.at(-1) : ''])
    }
    const csv = summary.map((row) => row.join(',')).join('\n').concat('\n')
    mkdirSync(resolve(experimentRoot, 'summary'), { recursive: true })
    writeFileSync(output, csv)
    writeFileSync(resolve(experimentRoot, 'summary/build-summary.md'), ['# Build summary', '', `Source: ${input}`, '', 'Failed runs remain counted separately and are not converted to zero seconds.', '', '```csv', csv.trimEnd(), '```', ''].join('\n'))
    console.log(`Build summary written to ${output}`)
  }
}
