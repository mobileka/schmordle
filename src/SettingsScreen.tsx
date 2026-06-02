import { useState, useEffect } from 'react'
import { useRenderer } from '@opentui/react'
import type { Strictness } from './storage'

interface SettingsScreenProps {
  strictness: Strictness
  prohibitAbsent: boolean
  onSave: (settings: { strictness: Strictness; prohibitAbsent: boolean }) => void
  onBack: () => void
}

const strictnessOptions: { value: Strictness; label: string; description: string }[] = [
  { value: 'relaxed', label: 'Relaxed', description: 'No restrictions on guesses' },
  { value: 'strict', label: 'Strict', description: 'Must use revealed present/correct letters' },
  { value: 'very-strict', label: 'Very Strict', description: 'Strict + correct letters stay in position' },
]

const TOTAL_ITEMS = strictnessOptions.length + 1

export function SettingsScreen({ strictness, prohibitAbsent, onSave, onBack }: SettingsScreenProps) {
  const renderer = useRenderer()
  const [currentStrictness, setCurrentStrictness] = useState(strictness)
  const [currentProhibitAbsent, setCurrentProhibitAbsent] = useState(prohibitAbsent)
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    const handler = (key: any) => {
      if (key.name === 'escape') {
        onSave({ strictness: currentStrictness, prohibitAbsent: currentProhibitAbsent })
        onBack()
        return
      }
      if (key.name === 'up') {
        setCursor(prev => (prev - 1 + TOTAL_ITEMS) % TOTAL_ITEMS)
        return
      }
      if (key.name === 'down') {
        setCursor(prev => (prev + 1) % TOTAL_ITEMS)
        return
      }
      if (key.name === 'space' || key.name === 'return') {
        if (cursor < strictnessOptions.length) {
          setCurrentStrictness(strictnessOptions[cursor]!.value)
        } else {
          setCurrentProhibitAbsent(prev => !prev)
        }
        return
      }
      const num = parseInt(key.name)
      if (num >= 1 && num <= 3) {
        setCurrentStrictness(strictnessOptions[num - 1]!.value)
        setCursor(num - 1)
        return
      }
      if (num === 4) {
        setCurrentProhibitAbsent(prev => !prev)
        setCursor(3)
        return
      }
    }

    renderer.keyInput.on('keypress', handler)
    return () => { renderer.keyInput.off('keypress', handler) }
  }, [renderer, onBack, onSave, cursor, currentStrictness, currentProhibitAbsent])

  return (
    <box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={2}>
      <text fg="#fff">SETTINGS</text>

      <box flexDirection="column" gap={1}>
        <text fg="#888">Strictness:</text>
        {strictnessOptions.map((opt, i) => (
          <box key={opt.value} flexDirection="row" gap={1} paddingLeft={2}>
            <text fg={cursor === i ? '#fff' : '#888'}>
              {cursor === i ? '▸ ' : '  '}[{i + 1}] {currentStrictness === opt.value ? '◉' : '○'} {opt.label}
            </text>
            <text fg="#555">— {opt.description}</text>
          </box>
        ))}

        <text fg="#888" marginTop={1}>Extra Challenges:</text>
        <box flexDirection="row" gap={1} paddingLeft={2}>
          <text fg={cursor === strictnessOptions.length ? '#fff' : '#888'}>
            {cursor === strictnessOptions.length ? '▸ ' : '  '}[4] [{currentProhibitAbsent ? '✓' : ' '}] Prohibit known absent letters
          </text>
        </box>
      </box>

      <box flexDirection="row" gap={4}>
        <text fg="#555">[↑↓] Navigate</text>
        <text fg="#555">[Space] Select</text>
        <text fg="#555">[Esc] Save & Back</text>
      </box>
    </box>
  )
}
