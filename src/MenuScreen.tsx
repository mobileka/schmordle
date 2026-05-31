import { useRenderer } from '@opentui/react'
import { useEffect, useRef } from 'react'
import { SelectRenderableEvents } from '@opentui/core'
import type { GameMode } from './storage'

interface MenuScreenProps {
  onSelect: (mode: GameMode) => void
  onSettings: () => void
  onHighScores: () => void
  onQuit: () => void
}

const modes: { name: string; value: GameMode }[] = [
  { name: '1. Zen', value: 'zen' },
  { name: '2. Relaxed', value: 'relaxed' },
  { name: '3. Normal', value: 'normal' },
  { name: '4. Hard', value: 'hard' },
  { name: '5. Insane', value: 'insane' },
  { name: '6. Custom', value: 'custom' },
]

export function MenuScreen({ onSelect, onSettings, onHighScores, onQuit }: MenuScreenProps) {
  const selectRef = useRef<any>(null)
  const renderer = useRenderer()

  useEffect(() => {
    if (!selectRef.current) return

    const handler = (index: number) => {
      const mode = modes[index]
      if (mode) onSelect(mode.value)
    }

    selectRef.current.on(SelectRenderableEvents.ITEM_SELECTED, handler)
    return () => selectRef.current?.off(SelectRenderableEvents.ITEM_SELECTED, handler)
  }, [onSelect])

  useEffect(() => {
    const handler = (key: any) => {
      if (key.name === 'escape') {
        onQuit()
        return
      }
      if (key.name === 's') {
        onSettings()
        return
      }
      if (key.name === 'h') {
        onHighScores()
        return
      }
      const num = parseInt(key.name)
      if (num >= 1 && num <= 6 && selectRef.current) {
        selectRef.current.setSelectedIndex(num - 1)
        selectRef.current.selectCurrent()
      }
    }

    renderer.keyInput.on('keypress', handler)
    return () => { renderer.keyInput.off('keypress', handler) }
  }, [renderer, onQuit, onSettings, onHighScores])

  return (
    <box alignItems="center" justifyContent="center" flexGrow={1} flexDirection="column" gap={2}>
      <ascii-font font="tiny" text="SCHMORDLE" />
      <select
        ref={selectRef}
        width={30}
        height={8}
        options={modes.map(m => ({ name: m.name, description: '' }))}
        showDescription={false}
        focused={true}
      />
      <box flexDirection="row" gap={4}>
        <text>[S] Settings</text>
        <text>[H] High Scores</text>
        <text>[Esc] Quit</text>
      </box>
    </box>
  )
}
