// src/app/destinations/page.tsx
'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { MapPin, Camera, DollarSign, Users, Calendar, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import TripPlannerForm from '@/components/features/trip-planner/TripPlannerForm'

const dummyDestinations = [
  {
    id: 1,
    name: 'Paris, France',
    image: '🇫🇷',
    description: 'The City of Light - Romance, art, and exquisite cuisine await',
    bestTime: 'April - October',
    avgBudget: '₹80,000',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine River', 'Notre-Dame'],
    instagramSpots: 12,
    category: 'Cultural'
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    image: '🇯🇵',
    description: 'Where tradition meets innovation - A perfect blend of old and new',
    bestTime: 'March - May, September - November',
    avgBudget: '₹90,000',
    highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Skytree', 'Harajuku'],
    instagramSpots: 15,
    category: 'Adventure'
  },
  {
    id: 3,
    name: 'Bali, Indonesia',
    image: '🇮🇩',
    description: 'Tropical paradise with stunning beaches and rich culture',
    bestTime: 'April - October',
    avgBudget: '₹50,000',
    highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur'],
    instagramSpots: 18,
    category: 'Adventure'
  },
  {
    id: 4,
    name: 'Dubai, UAE',
    image: '🇦🇪',
    description: 'Luxury and opulence in the heart of the desert',
    bestTime: 'November - March',
    avgBudget: '₹1,20,000',
    highlights: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall', 'Desert Safari'],
    instagramSpots: 14,
    category: 'Luxury'
  },
  {
    id: 5,
    name: 'Goa, India',
    image: '🇮🇳',
    description: 'Sun, sand, and vibrant nightlife on India\'s west coast',
    bestTime: 'November - February',
    avgBudget: '₹30,000',
    highlights: ['Baga Beach', 'Fort Aguada', 'Anjuna Flea Market', 'Spice Plantations'],
    instagramSpots: 10,
    category: 'Party'
  },
  {
    id: 6,
    name: 'Santorini, Greece',
    image: '🇬🇷',
    description: 'Stunning sunsets and white-washed buildings overlooking the Aegean',
    bestTime: 'May - September',
    avgBudget: '₹1,00,000',
    highlights: ['Oia Sunset', 'Red Beach', 'Fira Town', 'Wine Tasting'],
    instagramSpots: 16,
    category: 'Luxury'
  },
  {
    id: 7,
    name: 'New York, USA',
    image: '🇺🇸',
    description: 'The city that never sleeps - Iconic landmarks and endless energy',
    bestTime: 'April - June, September - November',
    avgBudget: '₹1,50,000',
    highlights: ['Statue of Liberty', 'Central Park', 'Times Square', 'Brooklyn Bridge'],
    instagramSpots: 20,
    category: 'Cultural'
  },
  {
    id: 8,
    name: 'Maldives',
    image: '🇲🇻',
    description: 'Crystal clear waters and overwater bungalows - Ultimate luxury',
    bestTime: 'November - April',
    avgBudget: '₹2,00,000',
    highlights: ['Overwater Villas', 'Snorkeling', 'Sunset Cruises', 'Spa Retreats'],
    instagramSpots: 22,
    category: 'Luxury'
  }
]

export default function DestinationsPage() {
  const [selectedDestination, setSelectedDestination] = useState<any>(null)
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [customBudget, setCustomBudget] = useState('')
  const [customPeople, setCustomPeople] = useState('2')
  const [customDays, setCustomDays] = useState('7')
  const [personality, setPersonality] = useState('adventure')

  const handleDestinationClick = (destination: any) => {
    setSelectedDestination(destination)
    setCustomBudget(destination.avgBudget.replace('₹', '').replace(',', ''))
    setShowCustomizer(true)
  }

  const handleStartPlanning = () => {
    if (!customBudget || !customPeople || !customDays) return
    
    // Determine personality based on destination category
    const categoryMap: Record<string, string> = {
      'Adventure': 'adventure',
      'Luxury': 'luxury',
      'Cultural': 'cultural',
      'Party': 'party'
    }
    setPersonality(categoryMap[selectedDestination.category] || 'adventure')
    setShowCustomizer(false)
  }

  if (showCustomizer && selectedDestination) {
    return (
      <div className="min-h-screen p-4 py-12">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-3xl p-8 md:p-10 mb-8"
          >
            <button
              onClick={() => setShowCustomizer(false)}
              className="mb-6 text-white/70 hover:text-white transition-colors flex items-center gap-2"
            >
              <ArrowRight className="h-5 w-5 rotate-180" />
              Back to Destinations
            </button>

            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{selectedDestination.image}</div>
              <h1 className="text-4xl font-bold text-white mb-2">{selectedDestination.name}</h1>
              <p className="text-slate-300/70">{selectedDestination.description}</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white/90 font-medium mb-3 text-sm">
                  <Users className="h-4 w-4 inline mr-2 text-amber-400/70" />
                  Number of Travelers
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={customPeople}
                  onChange={(e) => setCustomPeople(e.target.value)}
                  className="w-full p-4 rounded-xl glass-subtle border border-white/10 text-white placeholder-white/40 focus:border-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-3 text-sm">
                  <Calendar className="h-4 w-4 inline mr-2 text-rose-400/70" />
                  Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  className="w-full p-4 rounded-xl glass-subtle border border-white/10 text-white placeholder-white/40 focus:border-rose-400/30 focus:outline-none focus:ring-2 focus:ring-rose-400/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-3 text-sm">
                  <DollarSign className="h-4 w-4 inline mr-2 text-teal-400/70" />
                  Budget (₹)
                </label>
                <input
                  type="number"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  placeholder="Enter your budget"
                  className="w-full p-4 rounded-xl glass-subtle border border-white/10 text-white placeholder-white/40 focus:border-teal-400/30 focus:outline-none focus:ring-2 focus:ring-teal-400/10 transition-all"
                />
                <p className="text-slate-400/60 text-xs mt-2">Average budget: {selectedDestination.avgBudget}</p>
              </div>

              <motion.button
                onClick={handleStartPlanning}
                className="w-full py-5 bg-gradient-to-r from-amber-500/90 via-rose-500/90 to-teal-500/90 text-white font-semibold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(245, 158, 11, 0.25)" }}
                whileTap={{ scale: 0.98 }}
              >
                Start Planning My Trip →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (selectedDestination && !showCustomizer && customBudget && customPeople && customDays) {
    return (
      <TripPlannerForm 
        personality={personality}
        prefillData={{
          destination: selectedDestination.name,
          budget: parseInt(customBudget),
          days: parseInt(customDays),
          groupSize: parseInt(customPeople)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen p-4 py-12 pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-teal-300">Destinations</span>
          </h1>
          <p className="text-lg text-slate-300/70 max-w-2xl mx-auto">
            Discover amazing places and let AI craft your perfect itinerary
          </p>
        </motion.div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyDestinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 hover:glass-strong transition-all duration-300 cursor-pointer group"
              onClick={() => handleDestinationClick(destination)}
              whileHover={{ y: -5 }}
            >
              <div className="text-6xl mb-4 text-center">{destination.image}</div>
              
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400/90 transition-colors">
                {destination.name}
              </h3>
              
              <p className="text-slate-300/70 text-sm mb-4 line-clamp-2">
                {destination.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400/60 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {destination.bestTime}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {destination.avgBudget}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-rose-400/80" />
                  <span className="text-sm text-slate-300/70">{destination.instagramSpots} Instagram Spots</span>
                </div>
                <span className="px-3 py-1 rounded-full glass-subtle text-xs text-white/80">
                  {destination.category}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {destination.highlights.slice(0, 3).map((highlight, i) => (
                  <span key={i} className="px-2 py-1 rounded-lg glass-subtle text-xs text-white/70">
                    {highlight}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-amber-400/90 group-hover:text-amber-400 transition-colors">
                <span className="text-sm font-medium">Plan Trip</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

