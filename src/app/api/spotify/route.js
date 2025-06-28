// app/api/spotify/route.js
import { NextResponse } from "next/server"

const basic = Buffer.from(
  `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString("base64")

async function getAccessToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  })

  const data = await res.json()
  return data.access_token
}

export async function GET() {
  const accessToken = await getAccessToken()

  const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (res.status === 204) return NextResponse.json({ isPlaying: false })

  const song = await res.json()

  let playlistOwner = null

  if (song.context?.type === "playlist" && song.context.href) {
    const playlistRes = await fetch(song.context.href, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (playlistRes.ok) {
      const playlistData = await playlistRes.json()
      playlistOwner = {
        name: playlistData.owner.display_name,
        image: playlistData.owner.images?.[0]?.url || null,
      }
    }
  }

  const track = {
    isPlaying: song.is_playing,
    title: song.item.name,
    artist: song.item.artists.map((a) => a.name).join(", "),
    album: song.item.album.name,
    albumImageUrl: song.item.album.images[0].url,
    songUrl: song.item.external_urls.spotify,
    progress: song.progress_ms,
    duration: song.item.duration_ms,
    playlistUrl: song.context?.external_urls?.spotify || null,
    playlistOwner,
  }

  return NextResponse.json(track)
}
