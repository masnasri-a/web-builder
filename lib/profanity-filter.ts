/**
 * Profanity filter — Indonesian + English
 * Server-side only. Not imported on the client.
 */

// Indonesian kata kasar: substring match (morphology may join words)
const ID_WORDS = [
  "anjing", "anjir", "babi", "bangsat", "bajingan", "keparat", "bedebah",
  "brengsek", "kampret", "asu", "jancok", "jancuk", "cok", "cuk",
  "kontol", "memek", "ngentot", "ngentod", "pepek", "itil",
  "pukimak", "kimak", "sialan", "goblok", "mampus",
  "pelacur", "sundal", "bangke", "taik", "tahi",
]

// English profanity: word-boundary match to avoid false positives
const EN_WORDS = [
  "fuck", "fucking", "fucked", "fucker",
  "shit", "bullshit",
  "bitch", "bitching",
  "asshole",
  "bastard",
  "cunt",
  "slut", "whore",
  "motherfucker",
  "nigger", "nigga",
  "faggot",
]

export function containsProfanity(text: string): boolean {
  const lower = text.toLowerCase()
  if (ID_WORDS.some((w) => lower.includes(w))) return true
  if (EN_WORDS.some((w) => new RegExp(`\\b${w}\\b`).test(lower))) return true
  return false
}
