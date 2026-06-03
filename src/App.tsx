import { useState, useEffect, useCallback } from 'react'
import { useRenderer } from '@opentui/react'
import { loadConfig, saveConfig, type Config, type GameMode } from './storage'
import { loadHighScores, addHighScore, type HighScores } from './highScores'
import { SplashScreen } from './SplashScreen'
import { MenuScreen } from './MenuScreen'
import { GameScreen } from './GameScreen'
import { SettingsScreen } from './SettingsScreen'
import { HighScoresScreen } from './HighScoresScreen'
import { CustomConfigScreen } from './CustomConfigScreen'

const CONFIG_PATH = `${process.env.HOME}/.config/schmordle/config.json`
const HIGH_SCORES_PATH = `${process.env.HOME}/.config/schmordle/high-scores.json`

type Screen = 'splash' | 'menu' | 'game' | 'settings' | 'highScores' | 'customConfig'

export function App() {
  const [config, setConfig] = useState<Config | null>(null)
  const [highScores, setHighScores] = useState<HighScores>({})
  const [screen, setScreen] = useState<Screen>('splash')
  const [gameMode, setGameMode] = useState<GameMode>('normal')
  const [customTime, setCustomTime] = useState<number>(120)
  const renderer = useRenderer()

  const handleGameEnd = useCallback(async (score: number, streak: number) => {
    if (gameMode === 'custom') return
    if (!config?.username || score === 0) return
    await addHighScore(HIGH_SCORES_PATH, gameMode, {
      username: config.username,
      score,
      date: new Date().toISOString().split('T')[0] ?? '',
      strictness: config.settings.strictness,
      extraChallenges: config.settings.extraChallenges.prohibitAbsent ? ['Prohibit Absent'] : []
    })
    const updatedScores = await loadHighScores(HIGH_SCORES_PATH)
    setHighScores(updatedScores)
  }, [config, gameMode])

  useEffect(() => {
    Promise.all([
      loadConfig(CONFIG_PATH),
      loadHighScores(HIGH_SCORES_PATH)
    ]).then(([c, hs]) => {
      setConfig(c)
      setHighScores(hs)
      if (c.username) setScreen('menu')
    })
  }, [])

  if (!config) return null

  if (screen === 'splash' && !config.username) {
    return (
      <SplashScreen
        onSubmit={async (username) => {
          const updated = { ...config, username }
          await saveConfig(CONFIG_PATH, updated)
          setConfig(updated)
          setScreen('menu')
        }}
      />
    )
  }

  if (screen === 'game') {
    return (
      <GameScreen
        mode={gameMode}
        strictness={config.settings.strictness}
        extraChallenges={config.settings.extraChallenges}
        customTime={customTime}
        onQuit={() => setScreen('menu')}
        onHighScores={() => setScreen('highScores')}
        onGameEnd={handleGameEnd}
      />
    )
  }

  if (screen === 'settings') {
    return (
      <SettingsScreen
        strictness={config.settings.strictness}
        prohibitAbsent={config.settings.extraChallenges.prohibitAbsent}
        onSave={async (settings) => {
          const updated = {
            ...config,
            settings: {
              strictness: settings.strictness,
              extraChallenges: { prohibitAbsent: settings.prohibitAbsent }
            }
          }
          await saveConfig(CONFIG_PATH, updated)
          setConfig(updated)
        }}
        onBack={() => setScreen('menu')}
      />
    )
  }

  if (screen === 'highScores') {
    return (
      <HighScoresScreen
        highScores={highScores}
        onBack={() => setScreen('menu')}
      />
    )
  }

  if (screen === 'customConfig') {
    return (
      <CustomConfigScreen
        onStart={(seconds) => {
          setCustomTime(seconds)
          setGameMode('custom')
          setScreen('game')
        }}
        onBack={() => setScreen('menu')}
      />
    )
  }

  return (
    <MenuScreen
      onSelect={(mode) => {
        if (mode === 'custom') {
          setScreen('customConfig')
          return
        }
        setGameMode(mode)
        setScreen('game')
      }}
      onSettings={() => setScreen('settings')}
      onHighScores={() => setScreen('highScores')}
      onQuit={() => {
        renderer.destroy()
      }}
    />
  )
}
