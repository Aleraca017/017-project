"use client"

import { useEffect, useRef, useState } from "react"

export default function SpotifyNowPlaying() {
  const [track, setTrack] = useState(null)
  const [shouldAnimateArtist, setShouldAnimateArtist] = useState(false)
  const [shouldAnimateTitle, setShouldAnimateTitle] = useState(false)

  const artistContainerRef = useRef(null)
  const artistTextRef = useRef(null)

  const titleContainerRef = useRef(null)
  const titleTextRef = useRef(null)

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
    const interval = setInterval(fetchTrack, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (
      track &&
      artistContainerRef.current &&
      artistTextRef.current &&
      titleContainerRef.current &&
      titleTextRef.current
    ) {
      const artistContainerWidth = artistContainerRef.current.offsetWidth
      const artistTextWidth = artistTextRef.current.scrollWidth
      setShouldAnimateArtist(artistTextWidth > artistContainerWidth)

      const titleContainerWidth = titleContainerRef.current.offsetWidth
      const titleTextWidth = titleTextRef.current.scrollWidth
      setShouldAnimateTitle(titleTextWidth > titleContainerWidth)
    }
  }, [track])

  if (!track || !track.isPlaying) return null

  const progressPercent = (track.progress / track.duration) * 100

  return (
    <div className="fixed -bottom-2 md:bottom-5 -left-9 md:left-5 z-50 bg-zinc-950 border-2 border-white/5 bg-opacity-90 text-white text-xs flex flex-col gap-2 p-2 rounded-lg shadow-lg w-70 md:w-80 scale-60 md:scale-100">
      <a
        href={track.playlistUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-500 underline font-semibold hover:text-purple-300 text-left md:text-sm"
      >
        Veja o que nossa equipe está ouvindo
      </a>

      <div className="flex flex-row items-center gap-2">
        <img
          src={track.albumImageUrl}
          alt="Capa do álbum"
          className="w-16 h-16 rounded"
        />

        <div className="flex-1 w-full text-left">
          {/* Título com animação condicional */}
          <div
            className="w-full overflow-hidden whitespace-nowrap relative h-5"
            ref={titleContainerRef}
          >
            <a
              href={track.songUrl}
              target="_blank"
              rel="noopener noreferrer"
              ref={titleTextRef}
              className={`absolute font-semibold hover:underline text-base block text-white ${
                shouldAnimateTitle ? "animate-marquee" : ""
              }`}
            >
              {track.title}
            </a>
          </div>

          {/* Artista com animação condicional */}
          <div
            className="w-full overflow-hidden whitespace-nowrap relative h-5"
            ref={artistContainerRef}
          >
            <div
              ref={artistTextRef}
              className={`absolute text-gray-300 text-xs ${
                shouldAnimateArtist ? "animate-marquee" : ""
              }`}
            >
              {track.artist}
            </div>
          </div>

          {/* Dono da playlist */}
          {track.playlistOwner && (
            <div className="flex items-center justify-start gap-2 mt-1 text-gray-400">
              {track.playlistOwner.image && (
                <img
                  src={track.playlistOwner.image}
                  alt={track.playlistOwner.name}
                  className="w-4 h-4 md:w-5 md:h-5 rounded-full object-cover"
                />
              )}
              <span className="">Adicionado por: <strong>{track.playlistOwner.name}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="h-1 w-full bg-gray-600 rounded mt-1">
        <div
          className="h-full bg-green-500 rounded"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}
