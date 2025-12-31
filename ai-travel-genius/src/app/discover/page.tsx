// src/app/discover/page.tsx
'use client'
import { motion } from 'framer-motion'
import { Sparkles, MapPin, Camera, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DiscoverPage() {
  return (
    <div className="min-h-screen p-4 py-12 pt-24 md:pt-32">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <Sparkles className="h-16 w-16 text-amber-400/80" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-teal-300">Your Next Adventure</span>
          </h1>
          <p className="text-lg text-slate-300/70 max-w-2xl mx-auto">
            Let AI help you discover destinations that match your travel personality
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong rounded-2xl p-8"
          >
            <MapPin className="h-12 w-12 text-amber-400/80 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-3">Explore Destinations</h2>
            <p className="text-slate-300/70 mb-6">
              Browse our curated list of amazing destinations and get instant itinerary suggestions
            </p>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500/90 via-rose-500/90 to-teal-500/90 text-white font-semibold rounded-xl hover:shadow-xl transition-all"
            >
              View Destinations
              <span>→</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong rounded-2xl p-8"
          >
            <Camera className="h-12 w-12 text-rose-400/80 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-3">Instagram Spots</h2>
            <p className="text-slate-300/70 mb-6">
              Discover the most photogenic locations with optimal lighting times for perfect shots
            </p>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500/90 via-rose-500/90 to-teal-500/90 text-white font-semibold rounded-xl hover:shadow-xl transition-all"
            >
              Find Spots
              <span>→</span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-strong rounded-2xl p-8 text-center"
        >
          <TrendingUp className="h-12 w-12 text-teal-400/80 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-3">Start Planning</h2>
          <p className="text-slate-300/70 mb-6">
            Ready to create your perfect itinerary? Let our AI travel genius help you plan an unforgettable trip.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500/90 via-rose-500/90 to-teal-500/90 text-white font-semibold rounded-xl hover:shadow-xl transition-all"
          >
            <Sparkles className="h-5 w-5" />
            Plan Your Trip
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

