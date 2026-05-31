import { useState, useEffect } from 'react'
import { useRenderer } from '@opentui/react'
import { loadConfig, saveConfig, type Config } from './storage'
import { SplashScreen } from './SplashScreen'
import { MenuScreen } from './MenuScreen'

const CONFIG_PATH = `${process.env.HOME}/.config/schmordle/config.json`

export function App() {
  const [config, setConfig] = useState<Config | null>(null)
  const renderer = useRenderer()

  useEffect(() => {
    loadConfig(CONFIG_PATH).then(setConfig)
  }, [])

  if (!config) return null

  if (!config.username) {
    return (
      <SplashScreen
        onSubmit={async (username) => {
          const updated = { ...config, username }
          await saveConfig(CONFIG_PATH, updated)
          setConfig(updated)
        }}
      />
    )
  }

  return (
    <MenuScreen
      onSelect={(mode) => {
        console.log('Selected mode:', mode)
      }}
      onSettings={() => {
        console.log('Settings')
      }}
      onHighScores={() => {
        console.log('High Scores')
      }}
      onQuit={() => {
        renderer.destroy()
      }}
    />
  )
}
