// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Header from "@/components/layout/header";
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Travel Genius - Your Smart Trip Planner',
  description: 'What if trip planning was as addictive as Instagram and as smart as ChatGPT? Discover personalized itineraries with one-click booking!',
  keywords: 'AI travel planner, trip planner, travel itinerary, smart travel, EaseMyTrip',
  authors: [{ name: 'AI Travel Genius Team' }],
  openGraph: {
    title: 'AI Travel Genius - Your Smart Trip Planner',
    description: 'Revolutionary AI-powered trip planning with personalized itineraries and one-click booking',
    images: ['/images/hero-bg.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden`}>
          {/* Animated background gradient orbs - Softer, warmer tones */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/4 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
            <div className="absolute top-1/2 -left-40 w-96 h-96 bg-rose-500/4 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
            <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-teal-500/4 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '14s', animationDelay: '4s' }} />
          </div>

          <Header />
          {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#fff',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            },
          }}
          />
          </div>
      </body>
    </html>
  )
}
