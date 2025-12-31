// src/components/features/trip-planner/TripPlannerForm.tsx
'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, Plane, MapPin, Calendar, Users, DollarSign, ChevronDown } from 'lucide-react'
import ItineraryGenerator from './ItineraryGenerator'


interface TripPlannerFormProps {
  personality?: string;
  prefillData?: {
    destination?: string;
    budget?: number;
    days?: number;
    groupSize?: number;
  };
}

export default function TripPlannerForm({ personality: initialPersonality, prefillData }: TripPlannerFormProps) {
  const [selectedPersonality, setSelectedPersonality] = useState<string>(initialPersonality || 'adventure')
  const [formData, setFormData] = useState({
    destination: prefillData?.destination || '',
    budget: prefillData?.budget?.toString() || '',
    days: prefillData?.days?.toString() || '',
    groupSize: prefillData?.groupSize || 1,
    startDate: '',
    preferences: [] as string[]
  })
  const [showGenerator, setShowGenerator] = useState(false)


  // Replace this entire section with the safe version below
const personalityThemes = {
  adventure: {
    title: "Adventure Seeker 🏔️",
    color: "from-amber-400 to-orange-500",
    suggestions: ["Hiking", "Mountain climbing", "Water sports", "Wildlife safari"]
  },
  luxury: {
    title: "Luxury Lover ✨", 
    color: "from-rose-400 to-pink-500",
    suggestions: ["Spa retreats", "Fine dining", "Premium hotels", "Private tours"]
  },
  cultural: {
    title: "Culture Explorer 🏛️",
    color: "from-teal-400 to-cyan-500", 
    suggestions: ["Museums", "Historical sites", "Local festivals", "Art galleries"]
  },
  party: {
    title: "Social Butterfly 🎉",
    color: "from-rose-400 to-amber-400",
    suggestions: ["Nightlife", "Beach parties", "Music festivals", "Social events"]
  }
}

// ✅ SAFE ASSIGNMENT WITH FALLBACK
const currentTheme = personalityThemes[selectedPersonality as keyof typeof personalityThemes] || {
  title: "Adventure Seeker 🏔️",
  color: "from-amber-400 to-orange-500",
  suggestions: ["Hiking", "Mountain climbing", "Water sports", "Wildlife safari"]
}


  // const currentTheme = personalityThemes[personality as keyof typeof personalityThemes]

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  if (formData.destination && formData.budget && formData.days) {
    setShowGenerator(true)
  }
}
if (showGenerator) {
    return (
      <ItineraryGenerator 
        userInput={{
          destination: formData.destination,
          budget: parseInt(formData.budget),
          days: parseInt(formData.days),
          groupSize: formData.groupSize,
          personality: selectedPersonality,
          preferences: formData.preferences
        }}
        onBack={() => setShowGenerator(false)}
      />
    )
  }
  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-4xl mx-auto relative">
        {/* Back Button - Positioned to clear sticky header */}
        <motion.button 
          onClick={() => window.location.reload()}
          className="fixed top-20 md:top-24 left-4 md:left-6 z-40 glass-subtle text-white/70 hover:text-white p-3 rounded-xl hover:glass transition-all flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>
        
        {/* Header */}
        <motion.div 
          className="text-center mb-12 mt-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Personality Dropdown */}
          <div className="mb-6 flex justify-center">
            <div className="relative inline-block">
              <select
                value={selectedPersonality}
                onChange={(e) => setSelectedPersonality(e.target.value)}
                className="glass-strong rounded-xl px-6 py-3 pr-10 text-white font-semibold text-lg appearance-none cursor-pointer hover:glass transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              >
                {Object.entries(personalityThemes).map(([key, theme]) => (
                  <option key={key} value={key} className="bg-slate-900 text-white">
                    {theme.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70 pointer-events-none" />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-light text-white mb-3">
            Plan Your Perfect Trip
          </h1>
          <p className="text-slate-300/70 text-sm md:text-base max-w-2xl mx-auto">
            Share your preferences and our AI will craft a personalized itinerary
          </p>
        </motion.div>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="glass-strong rounded-3xl p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Destination */}
            <div>
              <label className="block text-white/90 font-medium mb-3 text-sm">
                <MapPin className="h-4 w-4 inline mr-2 text-amber-400/70" />
                Destination
              </label>
              <input
                type="text"
                placeholder="e.g., Paris, Tokyo, Goa"
                className="w-full p-4 rounded-xl glass-subtle border border-white/10 text-white placeholder-white/40 focus:border-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400/10 transition-all"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                required
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-white/90 font-medium mb-3 text-sm">
                <DollarSign className="h-4 w-4 inline mr-2 text-rose-400/70" />
                Budget
              </label>
              <input
                type="number"
                placeholder="₹50,000"
                className="w-full p-4 rounded-xl glass-subtle border border-white/10 text-white placeholder-white/40 focus:border-rose-400/30 focus:outline-none focus:ring-2 focus:ring-rose-400/10 transition-all"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-white/90 font-medium mb-3 text-sm">
                <Calendar className="h-4 w-4 inline mr-2 text-teal-400/70" />
                Duration
              </label>
              <input
                type="number"
                placeholder="7 days"
                min="1"
                max="30"
                className="w-full p-4 rounded-xl glass-subtle border border-white/10 text-white placeholder-white/40 focus:border-teal-400/30 focus:outline-none focus:ring-2 focus:ring-teal-400/10 transition-all"
                value={formData.days}
                onChange={(e) => setFormData({...formData, days: e.target.value})}
                required
              />
            </div>

            {/* Group Size */}
            <div>
              <label className="block text-white/90 font-medium mb-3 text-sm">
                <Users className="h-4 w-4 inline mr-2 text-rose-400/70" />
                Travelers
              </label>
              <input
                type="number"
                placeholder="2"
                min="1"
                max="20"
                className="w-full p-4 rounded-xl glass-subtle border border-white/10 text-white placeholder-white/40 focus:border-rose-400/30 focus:outline-none focus:ring-2 focus:ring-rose-400/10 transition-all"
                value={formData.groupSize}
                onChange={(e) => setFormData({...formData, groupSize: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>

          {/* Preferences based on personality */}
          <div className="mt-8">
            <label className="block text-white/90 font-medium mb-4 text-sm">
              Interests (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentTheme.suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    const newPrefs = formData.preferences.includes(suggestion)
                      ? formData.preferences.filter(p => p !== suggestion)
                      : [...formData.preferences, suggestion]
                    setFormData({...formData, preferences: newPrefs})
                  }}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    formData.preferences.includes(suggestion)
                      ? `bg-gradient-to-r ${currentTheme.color} text-white border-transparent shadow-lg`
                      : 'glass-subtle text-white/80 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className={`w-full mt-10 py-5 bg-gradient-to-r ${currentTheme.color} text-white font-semibold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all`}
            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.98 }}
          >
            <Plane className="h-5 w-5 inline mr-2" />
            Generate My AI Itinerary
          </motion.button>
        </motion.form>
      </div>

    </div>
    
  )
}
