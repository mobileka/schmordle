import { useState, useEffect } from 'react'
import { useRenderer } from '@opentui/react'
import { loadConfig, saveConfig, type Config, type GameMode } from './storage'
import { SplashScreen } from './SplashScreen'
import { MenuScreen } from './MenuScreen'
import { GameScreen } from './GameScreen'
import { SettingsScreen } from './SettingsScreen'

const CONFIG_PATH = `${process.env.HOME}/.config/schmordle/config.json`

type Screen = 'splash' | 'menu' | 'game' | 'settings'

export function App() {
  const [config, setConfig] = useState<Config | null>(null)
  const [screen, setScreen] = useState<Screen>('splash')
  const [gameMode, setGameMode] = useState<GameMode>('normal')
  const renderer = useRenderer()

  useEffect(() => {
    loadConfig(CONFIG_PATH).then((c) => {
      setConfig(c)
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
        onQuit={() => setScreen('menu')}
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

  return (
    <MenuScreen
      onSelect={(mode) => {
        setGameMode(mode)
        setScreen('game')
      }}
      onSettings={() => setScreen('settings')}
      onHighScores={() => {
        console.log('High Scores')
      }}
      onQuit={() => {
        renderer.destroy()
      }}
    />
  )
}
