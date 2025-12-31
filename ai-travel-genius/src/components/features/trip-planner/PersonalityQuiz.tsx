// src/components/features/trip-planner/PersonalityQuiz.tsx
'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowLeft, Sparkles } from 'lucide-react'

const personalityQuestions = [
  {
    question: "Your ideal vacation photo is:",
    options: [
      { id: 'adventure', text: "🏔️ Me conquering a mountain peak", emoji: "🏔️" },
      { id: 'luxury', text: "✨ Champagne by an infinity pool", emoji: "🥂" },
      { id: 'cultural', text: "🏛️ Ancient temple at golden hour", emoji: "🏛️" },
      { id: 'party', text: "🎉 Epic group shot at beach party", emoji: "🎉" }
    ]
  },
  {
    question: "Your perfect evening abroad would be:",
    options: [
      { id: 'adventure', text: "🌄 Watching sunset from a cliff", emoji: "🌄" },
      { id: 'luxury', text: "🍷 Michelin-starred dinner", emoji: "🍷" },
      { id: 'cultural', text: "🎭 Local theater performance", emoji: "🎭" },
      { id: 'party', text: "🕺 Dancing till dawn at hottest club", emoji: "🕺" }
    ]
  },
  {
    question: "When planning a trip, you prioritize:",
    options: [
      { id: 'adventure', text: "🎯 Unique experiences & thrills", emoji: "🎯" },
      { id: 'luxury', text: "💎 Comfort & premium services", emoji: "💎" },
      { id: 'cultural', text: "📚 Learning & authentic culture", emoji: "📚" },
      { id: 'party', text: "🎊 Fun & social connections", emoji: "🎊" }
    ]
  },
  {
    question: "Your travel budget philosophy:",
    options: [
      { id: 'adventure', text: "💪 Spend on experiences, save on accommodation", emoji: "💪" },
      { id: 'luxury', text: "👑 Quality over quantity, worth the splurge", emoji: "👑" },
      { id: 'cultural', text: "🎨 Balanced spending on cultural activities", emoji: "🎨" },
      { id: 'party', text: "🎈 Invest in nightlife & entertainment", emoji: "🎈" }
    ]
  },
  {
    question: "Your dream travel companion is:",
    options: [
      { id: 'adventure', text: "🧗 Fellow adventure enthusiast", emoji: "🧗" },
      { id: 'luxury', text: "🥂 Someone who appreciates finer things", emoji: "🥂" },
      { id: 'cultural', text: "🎓 Knowledgeable travel historian", emoji: "🎓" },
      { id: 'party', text: "🎉 Life of the party personality", emoji: "🎉" }
    ]
  }
];

const personalityResults = {
  adventure: {
    title: "Adventure Seeker 🏔️",
    description: "You live for thrills and unique experiences! Mountains, extreme sports, and off-the-beaten-path destinations call your name.",
    color: "from-orange-500 to-red-600"
  },
  luxury: {
    title: "Luxury Lover ✨",
    description: "You believe in traveling in style! Premium accommodations, fine dining, and exclusive experiences are your jam.",
    color: "from-purple-500 to-pink-600"
  },
  cultural: {
    title: "Culture Explorer 🏛️",
    description: "You're fascinated by history, art, and authentic local experiences! Museums, heritage sites, and cultural immersion excite you.",
    color: "from-blue-500 to-cyan-600"
  },
  party: {
    title: "Social Butterfly 🎉",
    description: "You travel to meet people and have fun! Nightlife, festivals, and social experiences are your travel priorities.",
    color: "from-pink-500 to-yellow-500"
  }
}

interface PersonalityQuizProps {
  onComplete: (personality: string) => void;
}

export default function PersonalityQuiz({ onComplete }: PersonalityQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [finalPersonality, setFinalPersonality] = useState<string>('')

  const handleAnswer = (answerId: string) => {
    const newAnswers = [...answers, answerId]
    setAnswers(newAnswers)

    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate personality based on answers
      const personality = calculatePersonality(newAnswers)
      setFinalPersonality(personality)
      setShowResult(true)
    }
  }

  const calculatePersonality = (answers: string[]): string => {
    const counts = answers.reduce((acc, answer) => {
      acc[answer] = (acc[answer] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
  }

  if (showResult) {
    const result = personalityResults[finalPersonality as keyof typeof personalityResults]
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-auto text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Your Travel Personality</h2>
            <div className={`text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r ${result.color}`}>
              {result.title}
            </div>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {result.description}
            </p>
          </motion.div>

          <motion.button
            onClick={() => onComplete(finalPersonality)}
            className={`px-12 py-6 bg-gradient-to-r ${result.color} text-white font-bold text-xl rounded-2xl shadow-2xl w-full`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            🚀 Plan My Perfect Trip!
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-3xl mx-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        layout
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => window.location.reload()}
              className="text-white/60 hover:text-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div className="text-blue-200">
              Question {currentQuestion + 1} of {personalityQuestions.length}
            </div>
          </div>
          
          <h3 className="text-4xl font-bold text-white mb-2">
            Discover Your Travel Personality 🔮
          </h3>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 mb-6">
            <motion.div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / personalityQuestions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="text-2xl text-white mb-8 text-center font-semibold">
            {personalityQuestions[currentQuestion].question}
          </h4>
          
          <div className="grid grid-cols-1 gap-4">
            {personalityQuestions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className="p-6 bg-white/10 hover:bg-white/20 rounded-2xl text-white text-left transition-all duration-300 border border-white/10 hover:border-white/30"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-3xl mr-4">{option.emoji}</span>
                <span className="text-lg">{option.text}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
