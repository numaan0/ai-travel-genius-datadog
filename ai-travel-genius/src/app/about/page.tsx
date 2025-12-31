// src/app/about/page.tsx
'use client'
import { motion } from 'framer-motion'
import { Sparkles, Heart, Target, Zap, Users, Globe } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 glass-subtle text-white/70 hover:text-white px-4 py-2 rounded-xl hover:glass transition-all"
          >
            <span>←</span> Back Home
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <Sparkles className="h-16 w-16 text-amber-400/80" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-teal-300">Story</span>
          </h1>
          <p className="text-xl text-slate-300/70 max-w-2xl mx-auto">
            Born from a simple frustration: planning trips shouldn't be this hard
          </p>
        </motion.div>

        {/* Story Content */}
        <div className="space-y-12">
          {/* The Problem */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-strong rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="glass-subtle rounded-xl p-3">
                <Target className="h-6 w-6 text-amber-400/80" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">The Problem We Solved</h2>
                <p className="text-slate-300/70 leading-relaxed">
                  We've all been there. Hours spent scrolling through travel blogs, comparing prices, 
                  trying to figure out the best time to visit that Instagram-worthy spot, and wondering 
                  if we're spending our budget wisely. Traditional trip planning is fragmented, time-consuming, 
                  and honestly? It kills the excitement before you even pack your bags.
                </p>
              </div>
            </div>
          </motion.div>

          {/* The Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-strong rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="glass-subtle rounded-xl p-3">
                <Heart className="h-6 w-6 text-rose-400/80" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">Our Vision</h2>
                <p className="text-slate-300/70 leading-relaxed mb-4">
                  What if trip planning was as addictive as Instagram and as smart as ChatGPT? 
                  We envisioned a platform where AI doesn't just suggest places—it understands YOU. 
                  Your personality, your budget, your desire for that perfect sunset photo, and your 
                  need for authentic experiences.
                </p>
                <p className="text-slate-300/70 leading-relaxed">
                  We believe every trip should feel personal, every moment should be optimized, 
                  and every rupee should be spent wisely. That's why we built AI Travel Genius—not 
                  just another travel app, but your personal travel companion powered by cutting-edge AI.
                </p>
              </div>
            </div>
          </motion.div>

          {/* What Makes Us Different */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-strong rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="glass-subtle rounded-xl p-3">
                <Zap className="h-6 w-6 text-teal-400/80" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">What Makes Us Different</h2>
                <div className="space-y-4">
                  <div className="glass-subtle rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-2">🎯 Smart Budget Allocation</h3>
                    <p className="text-slate-300/70 text-sm">
                      We don't just give you a total budget. We break it down intelligently: 
                      40% for accommodation, 30% for activities, 20% for transport, and 10% for food. 
                      This ensures you get the most value from every rupee.
                    </p>
                  </div>
                  <div className="glass-subtle rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-2">📸 Instagram-Optimized Intelligence</h3>
                    <p className="text-slate-300/70 text-sm">
                      Our AI doesn't just find beautiful spots—it tells you the best time to visit 
                      for perfect lighting. Golden hour at the Eiffel Tower? We've got you covered.
                    </p>
                  </div>
                  <div className="glass-subtle rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-2">🏖️ Activity Categorization</h3>
                    <p className="text-slate-300/70 text-sm">
                      Every activity is tagged: Adventure 🏖️ for thrill-seekers, Food 🍽️ for foodies, 
                      Instagram 📸 for content creators. Find exactly what matches your vibe.
                    </p>
                  </div>
                  <div className="glass-subtle rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-2">✨ Personalized Experience</h3>
                    <p className="text-slate-300/70 text-sm">
                      From personality quizzes to day-by-day plans, everything is tailored to YOU. 
                      Not generic recommendations—your perfect trip.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* The Team */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-strong rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="glass-subtle rounded-xl p-3">
                <Users className="h-6 w-6 text-indigo-400/80" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-3">Built With Passion</h2>
                <p className="text-slate-300/70 leading-relaxed">
                  AI Travel Genius is built by travelers, for travelers. We've experienced the pain points 
                  firsthand and used cutting-edge AI technology (powered by Google Gemini) to solve them. 
                  Every feature, every recommendation, every detail is crafted to make your travel planning 
                  experience not just easier, but genuinely exciting.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <div className="glass-strong rounded-3xl p-10">
              <Globe className="h-12 w-12 text-amber-400/80 mx-auto mb-4" />
              <h2 className="text-3xl font-semibold text-white mb-4">Ready to Plan Your Perfect Trip?</h2>
              <p className="text-slate-300/70 mb-8 max-w-xl mx-auto">
                Join thousands of travelers who've discovered the joy of AI-powered trip planning
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500/90 via-rose-500/90 to-teal-500/90 text-white font-semibold rounded-xl hover:shadow-xl transition-all"
              >
                Start Planning Now →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

