import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { GameMode, Strictness } from './storage'

export type HighScore = {
  username: string
  score: number
  date: string
  strictness: Strictness
  extraChallenges: string[]
}

export type HighScores = Partial<Record<GameMode, HighScore[]>>

export async function loadHighScores(path: string): Promise<HighScores> {
  try {
    const data = await readFile(path, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

export async function saveHighScores(path: string, scores: HighScores): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, JSON.stringify(scores, null, 2))
}

export async function addHighScore(
  path: string,
  mode: GameMode,
  score: HighScore
): Promise<void> {
  if (score.score === 0) return

  const scores = await loadHighScores(path)
  if (!scores[mode]) {
    scores[mode] = []
  }

  scores[mode]!.push(score)
  scores[mode]!.sort((a, b) => b.score - a.score)

  const userScores = scores[mode]!.filter(s => s.username === score.username)
  const otherScores = scores[mode]!.filter(s => s.username !== score.username)
  scores[mode] = [...otherScores, ...userScores.slice(0, 10)]

  await saveHighScores(path, scores)
}
