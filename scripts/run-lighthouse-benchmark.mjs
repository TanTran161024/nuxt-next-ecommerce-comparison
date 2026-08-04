import { existsSync, mkdtempSync, renameSync, rmSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
import { appendCsv, ensureDirectory, experimentRoot, isPlaceholder, now, readConfig, root, runCommand, shellArguments, shellCommand, writeText } from './experiment-utils.mjs'
import { lighthouseConfigurationErrors, lighthouseFlags } from './lighthouse-benchmark-options.mjs'

const config = readConfig()
const pilotDirectory = process.argv.includes('--pilot-02') ? 'pilot-02' : process.argv.includes('--pilot') ? 'pilot' : undefined
const pilot = Boolean(pilotDirectory)
const outputRoot = pilot ? resolve(experimentRoot, pilotDirectory) : experimentRoot
const runsPerCase = pilot ? 1 : config.runsPerCase
const pending = Object.entries(config.lighthouse).filter(([, value]) => isPlaceholder(value)).map(([key]) => key)
if (pending.length) throw new Error(`Lighthouse is blocked until confirmed: ${pending.join(', ')}`)
const configurationErrors = lighthouseConfigurationErrors(config.lighthouse)
if (configurationErrors.length) throw new Error(`Invalid Lighthouse configuration: ${configurationErrors.join('; ')}`)
const lighthouseCheck = await runCommand({ command: process.platform === 'win32' ? 'where lighthouse.cmd || where lighthouse' : 'command -v lighthouse' })
const localLighthouse = [
  resolve(root, 'node_modules/.bin/lighthouse.cmd'),
  resolve(root, 'nuxt-app/node_modules/.bin/lighthouse.cmd'),
  resolve(root, 'next-app/node_modules/.bin/lighthouse.cmd'),
].find(existsSync)
if (lighthouseCheck.exitCode !== 0 && !localLighthouse) throw new Error('Lighthouse CLI not found locally or on PATH. It was not installed automatically.')
const lighthouseExecutable = localLighthouse ? `"${localLighthouse}"` : 'lighthouse'

const portInUse = async (port) => runCommand({ command: process.platform === 'win32' ? `netstat -ano -p tcp | findstr /R /C:":${port} .*LISTENING"` : `lsof -iTCP:${port} -sTCP:LISTEN` })
const waitForUrl = async (url, timeoutMs = 30000) => {
  const until = Date.now() + timeoutMs
  while (Date.now() < until) {
    try { if ((await fetch(url)).ok) return } catch {}
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 500))
  }
  throw new Error(`Server did not become ready: ${url}`)
}
const stopServer = async (child) => {
  if (child.exitCode !== null) return
  if (process.platform === 'win32') await runCommand({ command: `taskkill /pid ${child.pid} /T /F` })
  else child.kill('SIGTERM')
}
const waitForPortFree = async (port, timeoutMs = 10000) => {
  const until = Date.now() + timeoutMs
  while (Date.now() < until) {
    if ((await portInUse(port)).exitCode !== 0) return
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250))
  }
  throw new Error(`Port ${port} was still occupied after stopping the server.`)
}
const reservePath = (directory, baseName, extension) => {
  let candidate = resolve(directory, `${baseName}.${extension}`)
  if (!existsSync(candidate)) return candidate
  candidate = resolve(directory, `${baseName}-${Date.now()}.${extension}`)
  return candidate
}
const headers = ['framework', 'page', 'run', 'performance', 'accessibility', 'best_practices', 'seo', 'fcp_ms', 'lcp_ms', 'tbt_ms', 'cls', 'measured_at', 'notes']
const resultCsv = resolve(outputRoot, 'raw-data/lighthouse-results.csv')

for (let run = 1; run <= runsPerCase; run += 1) {
  for (const framework of ['nuxt', 'next']) {
    const item = config.frameworks[framework]
    const occupied = await portInUse(item.port)
    if (occupied.exitCode === 0) throw new Error(`Port ${item.port} is occupied; refusing to kill an unidentified process:\n${occupied.stdout}`)
    const serverCommand = framework === 'nuxt' ? `${item.productionCommand} -- --port ${item.port}` : `${item.productionCommand} -- -p ${item.port}`
    const child = spawn(shellCommand, shellArguments(serverCommand), { cwd: resolve(root, item.directory), windowsHide: true, stdio: 'pipe', env: { ...process.env, PORT: String(item.port) } })
    let serverLog = ''
    child.stdout.on('data', (chunk) => { serverLog += chunk })
    child.stderr.on('data', (chunk) => { serverLog += chunk })
    try {
      await waitForUrl(`http://127.0.0.1:${item.port}/`)
      for (const page of config.pages) {
        const baseName = `${page.name}-run-${String(run).padStart(2, '0')}`
        const reportDirectory = resolve(outputRoot, 'lighthouse', framework)
        ensureDirectory(reportDirectory)
        const reportBaseName = existsSync(resolve(reportDirectory, `${baseName}.report.json`)) ? `${baseName}-${Date.now()}` : baseName
        const basePath = resolve(reportDirectory, reportBaseName)
        const profileDirectory = mkdtempSync(resolve(outputRoot, '.lighthouse-profile-'))
        const command = `${lighthouseExecutable} http://127.0.0.1:${item.port}${page.path} ${lighthouseFlags(config.lighthouse, profileDirectory).join(' ')} --output json --output html --output-path="${basePath}"`
        const measured = await runCommand({ command })
        rmSync(profileDirectory, { recursive: true, force: true })
        const logPath = reservePath(reportDirectory, `${baseName}.log`, 'txt')
        writeText(logPath, `${measured.stdout}${measured.stderr}`)
        if (measured.exitCode !== 0) throw new Error(`Lighthouse failed for ${framework}/${page.name}; log: ${logPath}`)
        const jsonPath = resolve(reportDirectory, `${reportBaseName}.report.json`)
        const htmlPath = resolve(reportDirectory, `${reportBaseName}.report.html`)
        const finalJson = reservePath(reportDirectory, baseName, 'json')
        const finalHtml = reservePath(reportDirectory, baseName, 'html')
        renameSync(jsonPath, finalJson)
        renameSync(htmlPath, finalHtml)
        const report = JSON.parse(await (await import('node:fs/promises')).readFile(finalJson, 'utf8'))
        const audit = (id) => report.audits[id].numericValue
        appendCsv(resultCsv, headers, {
          framework, page: page.name, run,
          performance: report.categories.performance.score * 100,
          accessibility: report.categories.accessibility.score * 100,
          best_practices: report.categories['best-practices'].score * 100,
          seo: report.categories.seo.score * 100,
          fcp_ms: audit('first-contentful-paint'), lcp_ms: audit('largest-contentful-paint'),
          tbt_ms: audit('total-blocking-time'), cls: audit('cumulative-layout-shift'),
          measured_at: now(),
          notes: `Lighthouse ${report.lighthouseVersion}; Chrome ${report.userAgent}; URL ${report.finalUrl}; HTML ${finalHtml}`,
        })
      }
    } finally {
      await stopServer(child)
      writeText(resolve(outputRoot, 'lighthouse', framework, `server-run-${String(run).padStart(2, '0')}.log`), serverLog)
      await waitForPortFree(item.port)
    }
  }
}
