import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { root } from './data-utils.mjs'

export { root }

export const experimentRoot = resolve(root, 'experimental-results')
export const configPath = resolve(experimentRoot, 'benchmark-config.json')
export const readConfig = () => JSON.parse(readFileSync(configPath, 'utf8'))
export const now = () => new Date().toISOString()
export const ensureDirectory = (path) => mkdirSync(path, { recursive: true })
export const shellCommand = process.platform === 'win32' ? 'cmd.exe' : 'sh'
export const shellArguments = (command) => process.platform === 'win32' ? ['/d', '/s', '/c', command] : ['-lc', command]

export const runCommand = ({ command, cwd = root, env = process.env, onData }) => new Promise((resolvePromise) => {
  const child = spawn(shellCommand, shellArguments(command), { cwd, env, windowsHide: true })
  let stdout = ''
  let stderr = ''
  child.stdout.on('data', (chunk) => { const text = chunk.toString(); stdout += text; onData?.(text) })
  child.stderr.on('data', (chunk) => { const text = chunk.toString(); stderr += text; onData?.(text) })
  child.on('error', (error) => resolvePromise({ exitCode: 1, stdout, stderr: `${stderr}${error.message}` }))
  child.on('close', (exitCode) => resolvePromise({ exitCode: exitCode ?? 1, stdout, stderr }))
})

export const csvCell = (value) => {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

export const parseCsvLine = (line) => {
  const cells = []
  let cell = ''
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    if (character === '"') {
      if (quoted && line[index + 1] === '"') { cell += '"'; index += 1 } else quoted = !quoted
    } else if (character === ',' && !quoted) { cells.push(cell); cell = '' } else cell += character
  }
  cells.push(cell)
  return cells
}

export const appendCsv = (path, headers, row) => {
  ensureDirectory(dirname(path))
  if (!existsSync(path)) writeFileSync(path, `${headers.join(',')}\n`)
  appendFileSync(path, `${headers.map((header) => csvCell(row[header])).join(',')}\n`)
}

export const writeText = (path, content) => {
  ensureDirectory(dirname(path))
  writeFileSync(path, content)
}

export const isPlaceholder = (value) => typeof value === 'string' && value.includes('[USER_CONFIRMATION_REQUIRED]')
export const commandExists = async (command) => (await runCommand({ command })).exitCode === 0
