import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { loadHighScores, saveHighScores, addHighScore } from './highScores'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

describe('highScores', () => {
  let tempDir: string
  let scoresPath: string

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'schmordle-test-'))
    scoresPath = join(tempDir, 'high-scores.json')
  })

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true })
  })

  test('loadHighScores returns empty object when file does not exist', async () => {
    const scores = await loadHighScores(scoresPath)
    expect(scores).toEqual({})
  })

  test('saveHighScores creates directory and file', async () => {
    const nestedPath = join(tempDir, 'nested', 'dir', 'high-scores.json')

    await saveHighScores(nestedPath, { normal: [{ username: 'alice', score: 100, date: '2026-01-01', strictness: 'relaxed', extraChallenges: [] }] })

    const loaded = await loadHighScores(nestedPath)
    expect(loaded.normal).toHaveLength(1)
    expect(loaded.normal![0]!.username).toBe('alice')
  })

  test('addHighScore stores and sorts scores descending', async () => {
    await saveHighScores(scoresPath, {})

    await addHighScore(scoresPath, 'normal', { username: 'alice', score: 100, date: '2026-01-01', strictness: 'relaxed', extraChallenges: [] })
    await addHighScore(scoresPath, 'normal', { username: 'alice', score: 200, date: '2026-01-02', strictness: 'relaxed', extraChallenges: [] })
    await addHighScore(scoresPath, 'normal', { username: 'alice', score: 50, date: '2026-01-03', strictness: 'relaxed', extraChallenges: [] })

    const scores = await loadHighScores(scoresPath)
    expect(scores.normal).toHaveLength(3)
    expect(scores.normal![0]!.score).toBe(200)
    expect(scores.normal![1]!.score).toBe(100)
    expect(scores.normal![2]!.score).toBe(50)
  })

  test('addHighScore skips score of 0', async () => {
    await saveHighScores(scoresPath, {})

    await addHighScore(scoresPath, 'normal', { username: 'alice', score: 0, date: '2026-01-01', strictness: 'relaxed', extraChallenges: [] })

    const scores = await loadHighScores(scoresPath)
    expect(scores.normal).toBeUndefined()
  })

  test('addHighScore keeps max 10 per mode per user', async () => {
    await saveHighScores(scoresPath, {})

    for (let i = 1; i <= 12; i++) {
      await addHighScore(scoresPath, 'normal', { username: 'alice', score: i * 10, date: '2026-01-01', strictness: 'relaxed', extraChallenges: [] })
    }

    const scores = await loadHighScores(scoresPath)
    expect(scores.normal).toHaveLength(10)
    expect(scores.normal![0]!.score).toBe(120)
    expect(scores.normal![9]!.score).toBe(30)
  })

  test('addHighScore does not affect other users scores', async () => {
    await saveHighScores(scoresPath, {})

    await addHighScore(scoresPath, 'normal', { username: 'alice', score: 100, date: '2026-01-01', strictness: 'relaxed', extraChallenges: [] })
    await addHighScore(scoresPath, 'normal', { username: 'bob', score: 200, date: '2026-01-02', strictness: 'strict', extraChallenges: [] })

    const scores = await loadHighScores(scoresPath)
    expect(scores.normal).toHaveLength(2)
    expect(scores.normal!.find(s => s.username === 'alice')!.score).toBe(100)
    expect(scores.normal!.find(s => s.username === 'bob')!.score).toBe(200)
  })
})
