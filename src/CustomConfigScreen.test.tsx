import { describe, it, expect } from 'bun:test'
import { readFileSync } from 'fs'

describe('CustomConfigScreen', () => {
  it('does not nest <text> inside <text> (use <span> for inline styling)', () => {
    const source = readFileSync('./src/CustomConfigScreen.tsx', 'utf-8')
    const textOpenRegex = /<text[^>]*>/g
    const lines = source.split('\n')
    
    for (const line of lines) {
      const textOpens = (line.match(textOpenRegex) || []).length
      if (textOpens > 1) {
        throw new Error(`Nested <text> elements found on line: ${line}`)
      }
    }
  })
})
