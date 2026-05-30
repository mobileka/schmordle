import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

export type Strictness = 'relaxed' | 'strict' | 'very-strict'
export type GameMode = 'zen' | 'relaxed' | 'normal' | 'hard' | 'insane' | 'custom'

export type HighScore = {
  username: string
  score: number
  date: string
  extraChallenges: string[]
}

export type Config = {
  username: string
  settings: {
    strictness: Strictness
    extraChallenges: { prohibitAbsent: boolean }
  }
  highScores: Partial<Record<GameMode, HighScore[]>>
}

const defaultConfig: Config = {
  username: '',
  settings: {
    strictness: 'relaxed',
    extraChallenges: { prohibitAbsent: false }
  },
  highScores: {}
}

export async function loadConfig(configPath: string): Promise<Config> {
  try {
    const data = await readFile(configPath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return JSON.parse(JSON.stringify(defaultConfig))
  }
}

export async function saveConfig(configPath: string, config: Config): Promise<void> {
  await mkdir(dirname(configPath), { recursive: true })
  await writeFile(configPath, JSON.stringify(config, null, 2))
}

export async function addHighScore(
  configPath: string,
  mode: GameMode,
  score: HighScore
): Promise<void> {
  if (score.score === 0) return

  const config = await loadConfig(configPath)
  if (!config.highScores[mode]) {
    config.highScores[mode] = []
  }

  config.highScores[mode]!.push(score)
  config.highScores[mode]!.sort((a, b) => b.score - a.score)
  config.highScores[mode] = config.highScores[mode]!.slice(0, 10)

  await saveConfig(configPath, config)
}
