"use client"
import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
import Header from "./Header"
import Footer from "./Footer"
import SpotifyNowPlaying from "./SnP"

export default function Layout({ children }) {
  useEffect(() => {
    AOS.init({ duration: 800 })
  }, [])

  return (
    <main className="bg-black text-white min-h-screen font-sans">
      <Header />
        <div className="pt-20">{children}</div>
        {// <SpotifyNowPlaying />
        }
      <Footer />
      
    </main>
  )
}
