'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [show, setShow] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-family-black px-4 text-center relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-family-gold/10 rounded-full blur-[120px]" />

      {show && (
        <div className="relative z-10">
          <p className="text-family-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4 opacity-0 animate-fadeUp">
            Est. Family
          </p>

          <h1 className="text-6xl md:text-8xl font-extrabold text-family-white animate-dropIn tracking-tight">
            Streicher
          </h1>

          <div
            className="w-16 h-px bg-family-gold mx-auto mt-6 mb-6 opacity-0 animate-fadeUp"
            style={{ animationDelay: '0.5s' }}
          />

          <p
            className="text-family-muted font-medium tracking-widest uppercase text-sm opacity-0 animate-fadeUp"
            style={{ animationDelay: '0.6s' }}
          >
            Family
          </p>

          <button
            onClick={() => router.push('/login')}
            className="mt-12 border border-family-gold text-family-gold font-semibold px-10 py-3 rounded-full opacity-0 animate-fadeUp hover:bg-family-gold hover:text-family-black transition-colors duration-300"
            style={{ animationDelay: '0.9s' }}
          >
            Enter
          </button>
        </div>
      )}
    </div>
  )
}