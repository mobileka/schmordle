import { useState, useEffect } from 'react'
import { useRenderer } from '@opentui/react'

interface CustomConfigScreenProps {
  onStart: (seconds: number) => void
  onBack: () => void
}

export function CustomConfigScreen({ onStart, onBack }: CustomConfigScreenProps) {
  const renderer = useRenderer()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const handler = (key: any) => {
      if (key.name === 'escape') {
        onBack()
        return
      }
      if (key.name === 'return') {
        const value = parseInt(input)
        if (!input || isNaN(value) || value < 1) {
          setError('Enter a number >= 1')
          return
        }
        onStart(value)
        return
      }
      if (key.name === 'backspace') {
        setInput(prev => prev.slice(0, -1))
        setError('')
        return
      }
      if (key.sequence && key.sequence.length === 1 && /[0-9]/.test(key.sequence)) {
        setInput(prev => prev + key.sequence)
        setError('')
        return
      }
    }

    renderer.keyInput.on('keypress', handler)
    return () => { renderer.keyInput.off('keypress', handler) }
  }, [renderer, onBack, onStart, input])

  return (
    <box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={2}>
      <text fg="#fff">CUSTOM MODE</text>
      <text fg="#888">Set timer (seconds):</text>
      <text fg="#fff">{input || '_'}<span fg="#888">_</span></text>
      {error ? <text fg="#ff6b6b">{error}</text> : null}
      <box flexDirection="row" gap={4}>
        <text fg="#555">[Enter] Start</text>
        <text fg="#555">[Esc] Back</text>
      </box>
    </box>
  )
}
