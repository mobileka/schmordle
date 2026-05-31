import words from '../data/dictionary.json'

const dictionary = new Set(words.map(w => w.toUpperCase()))

export function getRandomWord(): string {
  const word = words[Math.floor(Math.random() * words.length)]
  if (!word) throw new Error('Dictionary is empty')
  return word.toUpperCase()
}

export function isValidWord(word: string): boolean {
  return dictionary.has(word.toUpperCase())
}
