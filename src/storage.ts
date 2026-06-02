import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

export type Strictness = 'relaxed' | 'strict' | 'very-strict'
export type GameMode = 'zen' | 'relaxed' | 'normal' | 'hard' | 'insane' | 'custom'

export type Config = {
  username: string
  settings: {
    strictness: Strictness
    extraChallenges: { prohibitAbsent: boolean }
  }
}

const defaultConfig: Config = {
  username: '',
  settings: {
    strictness: 'relaxed',
    extraChallenges: { prohibitAbsent: false }
  }
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
