"use client"

import { useEffect, useRef, useState } from "react"
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react"

interface MusicPlayerProps {
  musicUrl: string
  autoPlay?: boolean
}

export function MusicPlayer({ musicUrl, autoPlay = false }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)

  // Start playing when autoPlay becomes true (after splash is dismissed)
  useEffect(() => {
    if (!autoPlay || !audioRef.current) return
    audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
  }, [autoPlay])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  function toggleMute() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !muted
    setMuted(!muted)
  }

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="none" />

      {/* Floating music controls — fixed bottom-right */}
      <div
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
        style={{ pointerEvents: "auto" }}
      >
        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 active:scale-95"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 active:scale-95"
          aria-label={playing ? "Pause music" : "Play music"}
        >
          {playing ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 translate-x-0.5" />
          )}
          {/* Animated rings when playing */}
          {playing && (
            <span className="absolute h-11 w-11 rounded-full border border-white/30 animate-ping" />
          )}
        </button>

        <Music className="h-3.5 w-3.5 text-white/40" />
      </div>
    </>
  )
}
