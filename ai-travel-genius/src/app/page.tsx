// src/app/page.tsx
'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Plane, Sparkles, Zap, Users, Clock, DollarSign, Camera } from 'lucide-react'
import PersonalityQuiz from '@/components/features/trip-planner/PersonalityQuiz'
import TripPlannerForm from '@/components/features/trip-planner/TripPlannerForm'

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(false)
  const [showPlanner, setShowPlanner] = useState(false)
  const [userPersonality, setUserPersonality] = useState<string>('')

  const handleQuizComplete = (personality: string) => {
    setUserPersonality(personality)
    setShowQuiz(false)
    setShowPlanner(true)
  }

  if (showPlanner) {
    return <TripPlannerForm personality={userPersonality} />
  }

  if (showQuiz) {
    return <PersonalityQuiz onComplete={handleQuizComplete} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          {/* Logo/Brand - Simplified */}
          <motion.div
            className="flex justify-center items-center mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-strong rounded-3xl px-8 py-4 flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-10 w-10 text-amber-400/80" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                AI Travel <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-teal-300">Genius</span>
              </h1>
            </div>
          </motion.div>

          {/* Main Headline - Cleaner */}
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Your smart trip planner,{' '}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-teal-300">
              reimagined
            </span>
          </motion.h2>

          {/* Subheading */}
          <motion.p 
            className="text-lg md:text-xl text-slate-300/70 mb-16 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            AI-powered itineraries tailored to your personality. Smart budget breakdown. Instagram-optimized spots.
          </motion.p>

          {/* Stats Row - Glassmorphism */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="glass rounded-2xl p-8 text-center hover:glass-strong transition-all duration-300">
              <div className="text-5xl font-bold text-amber-400/90 mb-3">40%</div>
              <div className="text-slate-300/70 text-sm font-medium">Accommodation</div>
            </div>
            <div className="glass rounded-2xl p-8 text-center hover:glass-strong transition-all duration-300">
              <div className="text-5xl font-bold text-rose-400/90 mb-3">30%</div>
              <div className="text-slate-300/70 text-sm font-medium">Activities</div>
            </div>
            <div className="glass rounded-2xl p-8 text-center hover:glass-strong transition-all duration-300">
              <div className="text-5xl font-bold text-teal-400/90 mb-3">20%</div>
              <div className="text-slate-300/70 text-sm font-medium">Transport</div>
            </div>
            <div className="glass rounded-2xl p-8 text-center hover:glass-strong transition-all duration-300">
              <div className="text-5xl font-bold text-indigo-400/90 mb-3">10%</div>
              <div className="text-slate-300/70 text-sm font-medium">Food</div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Buttons - Modern */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {/* Primary CTA */}
          <motion.button
            onClick={() => setShowQuiz(true)}
            className="group relative px-10 py-4 bg-gradient-to-r from-amber-500/90 via-rose-500/90 to-teal-500/90 text-white font-semibold text-lg rounded-xl shadow-lg overflow-hidden backdrop-blur-sm"
            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(245, 158, 11, 0.25)" }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Discover My Travel Personality
            </span>
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            onClick={() => setShowPlanner(true)}
            className="px-10 py-4 glass text-white font-medium text-lg rounded-xl hover:glass-strong transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Skip to Planner →
          </motion.button>
        </motion.div>

        {/* Feature Highlights - Glassmorphism Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.div 
            className="glass rounded-2xl p-8 text-center hover:glass-strong transition-all duration-300 group"
            whileHover={{ y: -5 }}
          >
            <div className="glass-subtle rounded-xl p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Users className="h-8 w-8 text-amber-400/80" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">AI Personality Match</h3>
            <p className="text-slate-300/60 text-sm leading-relaxed">Discover your travel style: Adventure Seeker, Luxury Lover, Culture Explorer, or Social Butterfly</p>
          </motion.div>
          <motion.div 
            className="glass rounded-2xl p-8 text-center hover:glass-strong transition-all duration-300 group"
            whileHover={{ y: -5 }}
          >
            <div className="glass-subtle rounded-xl p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Clock className="h-8 w-8 text-rose-400/80" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Real-Time Adaptation</h3>
            <p className="text-slate-300/60 text-sm leading-relaxed">Weather changes? Flight delays? Our AI adapts your itinerary instantly</p>
          </motion.div>
          <motion.div 
            className="glass rounded-2xl p-8 text-center hover:glass-strong transition-all duration-300 group"
            whileHover={{ y: -5 }}
          >
            <div className="glass-subtle rounded-xl p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
              <DollarSign className="h-8 w-8 text-teal-400/80" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Smart Budget Breakdown</h3>
            <p className="text-slate-300/60 text-sm leading-relaxed">Real-time cost allocation: 40% accommodation, 30% activities, 20% transport, 10% food</p>
          </motion.div>
        </motion.div>

        {/* Trust Indicators - Minimal */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <p className="text-slate-400/50 text-sm mb-6 font-light">Powered by</p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <div className="glass-subtle px-6 py-2 rounded-lg text-white/80 text-sm font-medium">Google Gemini AI</div>
            <div className="glass-subtle px-6 py-2 rounded-lg text-white/80 text-sm font-medium">Smart Algorithms</div>
            <div className="glass-subtle px-6 py-2 rounded-lg text-white/80 text-sm font-medium">Real-time Data</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
