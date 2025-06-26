"use client"

import { useEffect, useState } from "react"

export default function SpotifyNowPlaying() {
  const [track, setTrack] = useState(null)

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await fetch("/api/spotify")
        const data = await res.json()
        setTrack(data)
      } catch (err) {
        console.error("Erro ao buscar música do Spotify", err)
      }
    }

    fetchTrack()
    const interval = setInterval(fetchTrack, 1000) // Atualiza a cada 30s
    return () => clearInterval(interval)
  }, [])

  if (!track || !track.isPlaying) return null

  const progressPercent = (track.progress / track.duration) * 100

  return (
    <div className="fixed bottom-8 left-4 right-4 md:left-8 md:right-auto z-50 bg-zinc-950 bg-opacity-90 text-white flex flex-col gap-2 p-3 rounded-lg shadow-lg w-80">
      
      <a
        href={track.playlistUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-left text-sm text-purple-400 underline font-semibold hover:text-purple-300"
      >
        Veja o que nossa equipe está ouvindo neste momento
      </a>

      <div className="flex items-center gap-4">
        <img src={track.albumImageUrl} alt="Album cover" className="w-12 h-12 rounded" />
        <div className="flex-1">
          <a
            href={track.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
          >
            {track.title}
          </a>
          <p className="text-sm text-gray-300">{track.artist}</p>
          <div className="h-1 w-full bg-gray-600 rounded mt-1">
            <div
              className="h-full bg-green-500 rounded"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
