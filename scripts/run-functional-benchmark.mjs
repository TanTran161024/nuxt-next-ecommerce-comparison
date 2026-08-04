import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { csvCell, experimentRoot, now, parseCsvLine, root, runCommand, writeText } from './experiment-utils.mjs'

const testLogPath = resolve(experimentRoot, 'test-results', `functional-${now().replaceAll(':', '-')}.log`)
const nuxt = await runCommand({ command: 'npm test', cwd: resolve(root, 'nuxt-app') })
const next = await runCommand({ command: 'npm test', cwd: resolve(root, 'next-app') })
writeText(testLogPath, `# Nuxt\n${nuxt.stdout}${nuxt.stderr}\n# Next\n${next.stdout}${next.stderr}`)
if (nuxt.exitCode !== 0 || next.exitCode !== 0) {
  console.error(`Functional test run failed; log retained at ${testLogPath}`)
  process.exitCode = 1
} else {
  const csvPath = resolve(experimentRoot, 'test-results/functional-test-cases.csv')
  const lines = readFileSync(csvPath, 'utf8').split(/\r?\n/)
  const automaticallyCovered = new Set(['FT-01', 'FT-02', 'FT-03', 'FT-04', 'FT-05', 'FT-06', 'FT-07', 'FT-08', 'FT-09', 'FT-10'])
  const updated = lines.map((line, index) => {
    if (index === 0 || !line) return line
    const cells = parseCsvLine(line)
    if (automaticallyCovered.has(cells[0])) {
      cells[5] = 'PASS'
      cells[6] = now()
      cells[7] = `npm test pass; ${testLogPath.replace(root + '\\', '')}`
    }
    return cells.map(csvCell).join(',')
  })
  writeText(csvPath, updated.join('\n'))
  console.log(`Automated functional cases marked PASS only where covered by tests. Manual cases remain NEEDS_MANUAL_REVIEW. Log: ${testLogPath}`)
}
