import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { mkdirSync } from 'node:fs'
import { root } from './data-utils.mjs'

const pilotDirectory = process.argv.includes('--pilot-02') ? 'pilot-02' : process.argv.includes('--pilot') ? 'pilot' : undefined
const resultRoot = resolve(root, pilotDirectory ? `experimental-results/${pilotDirectory}` : 'experimental-results')
const defaultInput = resolve(resultRoot, 'raw-data/lighthouse-results.csv')
const defaultOutput = resolve(resultRoot, 'summary/lighthouse-summary.csv')
const argumentsByName = new Map(process.argv.slice(2).reduce((pairs, argument, index, argumentsList) => {
  if (argument.startsWith('--')) pairs.push([argument, argumentsList[index + 1]])
  return pairs
}, []))
const input = resolve(argumentsByName.get('--input') ?? defaultInput)
const output = resolve(argumentsByName.get('--output') ?? defaultOutput)
const dryRun = process.argv.includes('--dry-run')
const metrics = ['performance', 'accessibility', 'best_practices', 'seo', 'fcp_ms', 'lcp_ms', 'tbt_ms', 'cls']
const median = (values) => {
  const ordered = [...values].sort((left, right) => left - right)
  const middle = Math.floor(ordered.length / 2)
  return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2
}

const parseCsvLine = (line) => {
  const cells = []
  let cell = ''
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        cell += '"'
        index += 1
      } else quoted = !quoted
    } else if (character === ',' && !quoted) {
      cells.push(cell)
      cell = ''
    } else cell += character
  }
  cells.push(cell)
  return cells
}

const csvCell = (value) => {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

if (!existsSync(input)) {
  console.error(`No real Lighthouse CSV found at ${input}. Copy lighthouse-results-template.csv to lighthouse-results.csv and enter measured rows first.`)
  process.exitCode = 1
} else {
  const lines = readFileSync(input, 'utf8').split(/\r?\n/).filter((line) => line.trim())
  if (lines.length < 2) {
    console.error(`No measured rows found in ${input}. The script will not generate benchmark data.`)
    process.exitCode = 1
  } else {
    const headers = parseCsvLine(lines[0])
    const requiredHeaders = ['framework', 'page', ...metrics]
    const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header))
    if (missingHeaders.length) throw new Error(`Missing CSV columns: ${missingHeaders.join(', ')}`)
    const rows = lines.slice(1).map((line) => Object.fromEntries(headers.map((header, index) => [header, parseCsvLine(line)[index] ?? ''])))
    const groups = new Map()
    for (const row of rows) {
      if (!row.framework || !row.page) throw new Error('Every measured row must have framework and page.')
      const key = `${row.framework}\u0000${row.page}`
      groups.set(key, [...(groups.get(key) ?? []), row])
    }
    const summary = []
    for (const groupRows of groups.values()) {
      const [first] = groupRows
      const result = { framework: first.framework, page: first.page, runs: groupRows.length }
      for (const metric of metrics) {
        const values = groupRows.map((row) => Number(row[metric]))
        if (values.some((value) => !Number.isFinite(value))) throw new Error(`Metric ${metric} must be numeric for ${first.framework}/${first.page}.`)
        const average = values.reduce((sum, value) => sum + value, 0) / values.length
        const sampleStandardDeviation = values.length > 1
          ? Math.sqrt(values.reduce((sum, value) => sum + (value - average) ** 2, 0) / (values.length - 1))
          : ''
        result[`${metric}_mean`] = average
        result[`${metric}_sample_stddev`] = sampleStandardDeviation
        result[`${metric}_median`] = median(values)
        result[`${metric}_min`] = Math.min(...values)
        result[`${metric}_max`] = Math.max(...values)
      }
      summary.push(result)
    }
    const summaryHeaders = ['framework', 'page', 'runs', ...metrics.flatMap((metric) => [
      `${metric}_mean`, `${metric}_sample_stddev`, `${metric}_median`, `${metric}_min`, `${metric}_max`,
    ])]
    const csv = [summaryHeaders.join(','), ...summary.map((row) => summaryHeaders.map((header) => csvCell(row[header])).join(','))].join('\n').concat('\n')
    if (dryRun) {
      console.log('TEST DATA dry run: no summary file written.')
      console.log(csv)
    } else {
      mkdirSync(dirname(output), { recursive: true })
      writeFileSync(output, csv)
      const incomplete = summary.some((row) => row.runs < 2)
      const markdown = ['# Lighthouse summary', '', `Source: ${input}`, '', 'Values are descriptive only; this file does not rank frameworks.', ...(incomplete ? ['', 'Không đủ số lần đo để tính độ lệch chuẩn mẫu.'] : []), '', '```csv', csv.trimEnd(), '```', ''].join('\n')
      writeFileSync(resolve(dirname(output), 'lighthouse-summary.md'), markdown)
      console.log(`Summary written to ${output}`)
    }
  }
}
