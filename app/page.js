'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const TAGLINES = ['Family', 'Simchas', 'Memories', 'Yiddishkeit', 'Together']

export default function LandingPage() {
  const [show, setShow] = useState(false)
  const [taglineIndex, setTaglineIndex] = useState(0)
  const router = useRouter()

  const name = 'Streicher'

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 150)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % TAGLINES.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-family-black px-4 text-center relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-family-gold/10 rounded-full blur-[100px] md:blur-[140px] animate-pulse-slow" />
      <div className="absolute w-[180px] h-[180px] md:w-[300px] md:h-[300px] bg-family-gold/5 rounded-full blur-[80px] md:blur-[100px] top-1/4 left-1/4 animate-float" />
      <div className="absolute w-[150px] h-[150px] md:w-[250px] md:h-[250px] bg-family-gold/5 rounded-full blur-[80px] md:blur-[100px] bottom-1/4 right-1/4 animate-float-delayed" />

      {/* Drifting particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-family-gold/40 rounded-full animate-drift"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${8 + (i % 5)}s`,
            }}
          />
        ))}
      </div>

      {show && (
        <div className="relative z-10">
          {/* Emblem */}
          <div className="flex justify-center mb-6 opacity-0 animate-fadeUp">
            <svg width="40" height="40" viewBox="0 0 100 100" className="animate-spin-slow">
              <polygon points="50,10 90,80 10,80" fill="none" stroke="#D4AF37" strokeWidth="3" />
              <polygon points="50,90 10,20 90,20" fill="none" stroke="#D4AF37" strokeWidth="3" />
            </svg>
          </div>

          <p className="text-family-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4 opacity-0 animate-fadeUp" style={{ animationDelay: '0.15s' }}>
            Est. Family
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold text-family-white tracking-tight flex justify-center flex-wrap px-2">
            {name.split('').map((letter, i) => (
              <span
                key={i}
                className="inline-block opacity-0 animate-dropIn"
                style={{ animationDelay: `${0.3 + i * 0.06}s` }}
              >
                {letter}
              </span>
            ))}
          </h1>

          <div
            className="w-16 h-px bg-family-gold mx-auto mt-6 mb-6 opacity-0 animate-fadeUp"
            style={{ animationDelay: '1.1s' }}
          />

          <div className="h-5 relative overflow-hidden opacity-0 animate-fadeUp" style={{ animationDelay: '1.2s' }}>
            {TAGLINES.map((tag, i) => (
              <p
                key={tag}
                className={`text-family-muted font-medium tracking-widest uppercase text-sm absolute inset-0 transition-all duration-700 ${
                  i === taglineIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                {tag}
              </p>
            ))}
          </div>

          <button
            onClick={() => router.push('/login')}
            className="mt-12 border border-family-gold text-family-gold font-semibold px-10 py-3 rounded-full opacity-0 animate-fadeUp hover:bg-family-gold hover:text-family-black transition-colors duration-300 animate-breathe"
            style={{ animationDelay: '1.4s' }}
          >
            Enter
          </button>
        </div>
      )}
    </div>
  )
}