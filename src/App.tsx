import { useState, useEffect } from 'react'
import { loadConfig, saveConfig, type Config } from './storage'
import { SplashScreen } from './SplashScreen'

const CONFIG_PATH = `${process.env.HOME}/.config/schmordle/config.json`

export function App() {
  const [config, setConfig] = useState<Config | null>(null)

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
    <box alignItems="center" justifyContent="center" flexGrow={1}>
      <text>Welcome, {config.username}! (Menu coming soon)</text>
    </box>
  )
}
