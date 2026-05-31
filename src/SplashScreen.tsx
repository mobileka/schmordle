import { useState } from 'react'

interface SplashScreenProps {
  onSubmit: (username: string) => void
}

export function SplashScreen({ onSubmit }: SplashScreenProps) {
  const [username, setUsername] = useState('')

  return (
    <box alignItems="center" justifyContent="center" flexGrow={1} flexDirection="column" gap={2}>
      <ascii-font font="tiny" text="SCHMORDLE" />
      <text>Enter your username:</text>
      <box style={{ border: true, width: 30, height: 3 }}>
        <input
          placeholder="Username..."
          onInput={setUsername}
          onSubmit={() => {
            if (username.trim()) onSubmit(username.trim())
          }}
          focused={true}
        />
      </box>
    </box>
  )
}
