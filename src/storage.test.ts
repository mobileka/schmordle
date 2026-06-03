import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { loadConfig, saveConfig, type Config } from './storage'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

describe('storage', () => {
  let tempDir: string
  let configPath: string

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'schmordle-test-'))
    configPath = join(tempDir, 'config.json')
  })

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true })
  })

  test('loadConfig returns defaults when file does not exist', async () => {
    const config = await loadConfig(configPath)
    expect(config.username).toBe('')
    expect(config.settings.strictness).toBe('relaxed')
    expect(config.settings.extraChallenges.prohibitAbsent).toBe(false)
  })

  test('saveConfig creates directory and file', async () => {
    const nestedPath = join(tempDir, 'nested', 'dir', 'config.json')
    const config = await loadConfig(configPath)
    config.username = 'testuser'
    await saveConfig(nestedPath, config)

    const loaded = await loadConfig(nestedPath)
    expect(loaded.username).toBe('testuser')
  })

  test('loadConfig reads saved data', async () => {
    const config: Config = {
      username: 'alice',
      settings: { strictness: 'strict', extraChallenges: { prohibitAbsent: true } }
    }
    await saveConfig(configPath, config)

    const loaded = await loadConfig(configPath)
    expect(loaded.username).toBe('alice')
    expect(loaded.settings.strictness).toBe('strict')
  })

  test('loadConfig returns defaults for corrupt JSON', async () => {
    writeFileSync(configPath, 'not valid json{{{')
    const config = await loadConfig(configPath)
    expect(config.username).toBe('')
    expect(config.settings.strictness).toBe('relaxed')
  })
})
