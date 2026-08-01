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
    <div className="min-h-screen flex flex-col items-center justify-center bg-family-cream px-4 text-center">
      {show && (
        <>
          <h1 className="text-5xl md:text-7xl font-extrabold text-family-deep animate-dropIn">
            Streicher
          </h1>
          <p
            className="text-family-warm font-medium tracking-widest uppercase mt-3 opacity-0 animate-dropIn"
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
            Family
          </p>

          <button
            onClick={() => router.push('/login')}
            className="mt-10 bg-family-warm text-white font-semibold px-8 py-3 rounded-full opacity-0 animate-dropIn hover:opacity-90 transition"
            style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
          >
            Enter
          </button>
        </>
      )}
    </div>
  )
}