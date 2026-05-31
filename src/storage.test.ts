import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { loadConfig, saveConfig, addHighScore, type Config } from './storage'
import { mkdtempSync, rmSync } from 'node:fs'
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
    expect(config.username).toBe('huh')
    expect(config.settings.strictness).toBe('relaxed')
    expect(config.settings.extraChallenges.prohibitAbsent).toBe(false)
    expect(config.highScores).toEqual({})
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
      settings: { strictness: 'strict', extraChallenges: { prohibitAbsent: true } },
      highScores: {}
    }
    await saveConfig(configPath, config)

    const loaded = await loadConfig(configPath)
    expect(loaded.username).toBe('alice')
    expect(loaded.settings.strictness).toBe('strict')
  })

  test('addHighScore stores and sorts scores', async () => {
    await saveConfig(configPath, await loadConfig(configPath))

    await addHighScore(configPath, 'normal', { username: 'alice', score: 100, date: '2026-01-01', extraChallenges: [] })
    await addHighScore(configPath, 'normal', { username: 'alice', score: 200, date: '2026-01-02', extraChallenges: [] })
    await addHighScore(configPath, 'normal', { username: 'alice', score: 50, date: '2026-01-03', extraChallenges: [] })

    const config = await loadConfig(configPath)
    const scores = config.highScores.normal!
    expect(scores.length).toBe(3)
    expect(scores[0].score).toBe(200)
    expect(scores[1].score).toBe(100)
    expect(scores[2].score).toBe(50)
  })

  test('addHighScore skips score of 0', async () => {
    await saveConfig(configPath, await loadConfig(configPath))
    await addHighScore(configPath, 'normal', { username: 'alice', score: 0, date: '2026-01-01', extraChallenges: [] })

    const config = await loadConfig(configPath)
    expect(config.highScores.normal).toBeUndefined()
  })
})
