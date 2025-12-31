// src/components/features/trip-planner/ItineraryDisplay.tsx
'use client'
import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { jsPDF } from 'jspdf'
import { 
  ArrowLeft, MapPin, Calendar, DollarSign, Users, Camera, 
  Clock, Plane, Hotel, Star, Download, Share2, CheckCircle,
  AlertCircle, Info, Sparkles, ExternalLink, X, MapIcon
} from 'lucide-react'
import toast from 'react-hot-toast'
import ChatbotPopover from './ChatbotPopover'

interface ItineraryDisplayProps {
  itinerary: any
  userInput: any
  onBack: () => void
}

export default function ItineraryDisplay({ itinerary, userInput, onBack }: ItineraryDisplayProps) {
  const [selectedDay, setSelectedDay] = useState(1)
  const [showBooking, setShowBooking] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  
  // Ref for PDF generation
  const pdfRef = useRef<HTMLDivElement>(null)

  const handleBookTrip = () => {
    setShowBooking(true)
    toast.success('🎉 Opening activity details for booking!')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('📋 Itinerary link copied! Share with friends!')
  }

  // Enhanced PDF Download Function
  const handleDownload = async () => {
    if (isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    
    // Show loading toast
    const loadingToast = toast.loading('📄 Generating your travel itinerary PDF...', {
      duration: 0, // Keep it until we dismiss it
    });

    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add title page
      pdf.setFillColor(59, 130, 246); // Blue background
      pdf.rect(0, 0, pageWidth, 60, 'F');
      
      // Title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AI Travel Genius', pageWidth / 2, 25, { align: 'center' });
      
      pdf.setFontSize(20);
      pdf.text('Your Epic Travel Itinerary', pageWidth / 2, 40, { align: 'center' });
      
      // Trip details
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${userInput.destination} Adventure`, 20, 80);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Duration: ${userInput.days} Days`, 20, 95);
      pdf.text(`Travelers: ${userInput.groupSize} People`, 20, 105);
      pdf.text(`Budget: ₹${(itinerary.totalEstimatedCost || userInput.budget).toLocaleString()}`, 20, 115);
      pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 20, 125);

      // Budget breakdown
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Budget Breakdown', 20, 145);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const totalBudget = itinerary.totalEstimatedCost || userInput.budget;
      pdf.text(`Accommodation: ₹${Math.floor(totalBudget * 0.4).toLocaleString()}`, 25, 155);
      pdf.text(`Activities: ₹${Math.floor(totalBudget * 0.3).toLocaleString()}`, 25, 165);
      pdf.text(`Transportation: ₹${Math.floor(totalBudget * 0.2).toLocaleString()}`, 25, 175);
      pdf.text(`Food & Misc: ₹${Math.floor(totalBudget * 0.1).toLocaleString()}`, 25, 185);

      let yPosition = 210;

      // Daily itinerary
      if (itinerary.dailyPlans && itinerary.dailyPlans.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Day-by-Day Itinerary', 20, yPosition);
        yPosition += 15;

        for (const dayPlan of itinerary.dailyPlans) {
          // Check if we need a new page
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = 20;
          }

          // Day header
          pdf.setFillColor(240, 248, 255);
          pdf.rect(15, yPosition - 5, pageWidth - 30, 12, 'F');
          
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(59, 130, 246);
          pdf.text(`Day ${dayPlan.day}`, 20, yPosition + 3);
          yPosition += 20;

          // Activities
          if (dayPlan.activities && dayPlan.activities.length > 0) {
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');

            for (const activity of dayPlan.activities) {
              // Check page space
              if (yPosition > pageHeight - 30) {
                pdf.addPage();
                yPosition = 20;
              }

              // Activity title
              pdf.setFont('helvetica', 'bold');
              pdf.text(`• ${activity.title}`, 25, yPosition);
              yPosition += 8;

              // Activity details
              pdf.setFont('helvetica', 'normal');
              pdf.setFontSize(9);
              
              // Split description into multiple lines if too long
              const description = activity.description || 'Experience this amazing activity!';
              const splitDescription = pdf.splitTextToSize(description, pageWidth - 60);
              pdf.text(splitDescription, 30, yPosition);
              yPosition += splitDescription.length * 5;

              // Activity info
              pdf.text(`Duration: ${activity.duration || '2-3 hours'}`, 30, yPosition);
              yPosition += 5;
              pdf.text(`Cost: ₹${(activity.cost || 0).toLocaleString()} per person`, 30, yPosition);
              yPosition += 5;
              if (activity.timing) {
                pdf.text(`Best Time: ${activity.timing}`, 30, yPosition);
                yPosition += 5;
              }
              
              // Activity type badge
              if (activity.type) {
                const typeText = activity.type === 'instagram' ? '📸 Instagram Spot' : 
                               activity.type === 'food' ? '🍽️ Cuisine' : 
                               activity.type === 'adventure' ? '🏖️ Adventure' : activity.type;
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(8);
                pdf.text(typeText, 30, yPosition);
                yPosition += 10;
              } else {
                yPosition += 5;
              }
            }
          }
          
          yPosition += 10; // Space between days
        }
      }

      // AI Recommendations
      if (itinerary.aiRecommendations && itinerary.aiRecommendations.length > 0) {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(59, 130, 246);
        pdf.text('🤖 AI Travel Tips', 20, yPosition);
        yPosition += 15;

        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');

        for (let i = 0; i < itinerary.aiRecommendations.length && i < 5; i++) {
          const tip = itinerary.aiRecommendations[i];
          const splitTip = pdf.splitTextToSize(`• ${tip}`, pageWidth - 40);
          pdf.text(splitTip, 25, yPosition);
          yPosition += splitTip.length * 6 + 5;
          
          if (yPosition > pageHeight - 30) break;
        }
      }

      // Footer on last page
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Generated by AI Travel Genius - Your Ultimate Travel Companion', pageWidth / 2, pageHeight - 15, { align: 'center' });
      pdf.text('Visit us at: https://aitravelgenius.com', pageWidth / 2, pageHeight - 8, { align: 'center' });

      // Generate filename
      const fileName = `${userInput.destination.replace(/\s+/g, '_')}_${userInput.days}Day_Itinerary_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Save the PDF
      pdf.save(fileName);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('📄 PDF downloaded successfully! Your itinerary is ready!', {
        duration: 4000,
        icon: '✅',
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      toast.dismiss(loadingToast);
      toast.error('❌ Failed to generate PDF. Please try again.', {
        duration: 4000,
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  }

  const handleViewDetails = (activity: any) => {
    setSelectedActivity(activity)
    setShowActivityModal(true)
  }

  const handleMakeReservation = (activity: any) => {
    toast.success(`🎯 Reservation request sent for ${activity.title}!`)
  }

  // Get current day's data
  const currentDay = itinerary.dailyPlans?.find((plan: any) => plan.day === selectedDay)

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 relative" ref={pdfRef}>
      {/* Celebration Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 3, duration: 2 }}
            onAnimationComplete={() => setShowConfetti(false)}
          >
            <div className="w-full h-full relative">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][i % 6],
                    left: `${Math.random() * 100}%`,
                  }}
                  initial={{ y: -50, opacity: 1, rotate: 0 }}
                  animate={{ 
                    y: window.innerHeight + 50,
                    opacity: 0,
                    rotate: 360
                  }}
                  transition={{ 
                    duration: Math.random() * 3 + 2,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Activity Details Modal */}
      {showActivityModal && selectedActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {selectedActivity.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-blue-300">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {selectedActivity.duration}
                  </span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    {selectedActivity.rating}/5
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ₹{selectedActivity.cost.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowActivityModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-white mb-3">📍 Activity Details</h4>
                <p className="text-blue-100 text-lg leading-relaxed">
                  {selectedActivity.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <h5 className="text-white font-semibold mb-2">⏰ Timing</h5>
                  <p className="text-blue-200">{selectedActivity.timing}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <h5 className="text-white font-semibold mb-2">🎯 Activity Type</h5>
                  <p className="text-blue-200 capitalize">{selectedActivity.type}</p>
                </div>
              </div>

              {selectedActivity.type === 'instagram' && (
                <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-4 border border-pink-300/30">
                  <h5 className="text-white font-semibold mb-2 flex items-center">
                    <Camera className="h-5 w-5 mr-2 text-pink-400" />
                    📸 Instagram Tips
                  </h5>
                  <p className="text-pink-200">
                    Perfect for social media! This spot is known for stunning visuals and gets thousands of likes. 
                    Best lighting conditions during the scheduled time.
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <motion.button
                  onClick={() => handleMakeReservation(selectedActivity)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {selectedActivity.type === 'food' ? '🍽️ Make Reservation' : '🎫 Book Activity'}
                </motion.button>
                <motion.button
                  onClick={() => setShowActivityModal(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button 
            onClick={onBack}
            className="flex items-center text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-6 w-6 mr-2" />
            Back to Planning
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
            <motion.button
              onClick={handleDownload}
              disabled={isGeneratingPDF}
              className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
                isGeneratingPDF 
                  ? 'bg-gray-500/50 cursor-not-allowed' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              whileHover={!isGeneratingPDF ? { scale: 1.02 } : {}}
              whileTap={!isGeneratingPDF ? { scale: 0.98 } : {}}
            >
              <Download className={`h-4 w-4 mr-2 ${isGeneratingPDF ? 'animate-bounce' : ''}`} />
              {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
            </motion.button>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <Sparkles className="h-16 w-16 text-amber-400/80 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white mb-4">
            🎉 Your Personalized Itinerary is Ready!
          </h1>
          <p className="text-xl text-slate-300/80">
            Crafted just for you, <span className="text-amber-400/90 font-semibold">{userInput.personality}</span>! 
            Get ready for an <span className="text-rose-400/90 font-semibold">unforgettable adventure</span>!
          </p>
        </motion.div>

        {/* Rest of your existing component JSX remains the same... */}
        {/* Trip Overview Card, Day-by-Day Itinerary, AI Recommendations, One-Click Booking Section */}
        {/* I'm keeping the rest of your code unchanged for brevity */}

        {/* Trip Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20"
        >
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-white mb-2">
              {itinerary.tripTitle || `Amazing ${userInput.days}-Day ${userInput.destination} Adventure`}
            </h2>
            <div className="flex justify-center items-center space-x-6 text-blue-200">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {userInput.destination}
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                {userInput.days} Days
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {userInput.groupSize} Travelers
              </div>
            </div>
          </div>

          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center bg-white/10 rounded-2xl p-4">
              <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                ₹{itinerary.totalEstimatedCost?.toLocaleString() || userInput.budget.toLocaleString()}
              </div>
              <div className="text-blue-300 text-sm">Total Budget</div>
            </div>
            <div className="text-center bg-white/10 rounded-2xl p-4">
              <Hotel className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                ₹{Math.floor((itinerary.totalEstimatedCost || userInput.budget) * 0.4).toLocaleString()}
              </div>
              <div className="text-blue-300 text-sm">Accommodation (40%)</div>
            </div>
            <div className="text-center bg-white/10 rounded-2xl p-4">
              <Plane className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                ₹{Math.floor((itinerary.totalEstimatedCost || userInput.budget) * 0.3).toLocaleString()}
              </div>
              <div className="text-blue-300 text-sm">Activities (30%)</div>
            </div>
            <div className="text-center bg-white/10 rounded-2xl p-4">
              <Plane className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                ₹{Math.floor((itinerary.totalEstimatedCost || userInput.budget) * 0.2).toLocaleString()}
              </div>
              <div className="text-blue-300 text-sm">Transport (20%)</div>
            </div>
          </div>
          
          {/* Additional Budget Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center bg-white/10 rounded-2xl p-4">
              <DollarSign className="h-6 w-6 text-amber-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                ₹{Math.floor((itinerary.totalEstimatedCost || userInput.budget) * 0.1).toLocaleString()}
              </div>
              <div className="text-blue-300 text-sm">Food (10%)</div>
            </div>
            <div className="text-center bg-white/10 rounded-2xl p-4">
              <Camera className="h-6 w-6 text-rose-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">
                {itinerary.dailyPlans?.reduce((acc: number, plan: any) => 
                  acc + (plan.activities?.filter((a: any) => a.instagramSpot).length || 0), 0) || 0}
              </div>
              <div className="text-blue-300 text-sm">Instagram Spots</div>
            </div>
          </div>
        </motion.div>

        {/* Day-by-Day Itinerary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Day Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Days</h3>
            <div className="space-y-2">
              {itinerary.dailyPlans?.map((dayPlan: any) => (
                <button
                  key={dayPlan.day}
                  onClick={() => setSelectedDay(dayPlan.day)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedDay === dayPlan.day
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span>Day {dayPlan.day}</span>
                      <div className="text-xs opacity-70 mt-1">
                        {dayPlan.activities?.length || 0} activities
                      </div>
                    </div>
                    {selectedDay === dayPlan.day && <CheckCircle className="h-5 w-5" />}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Day Details */}
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-white">
                  Day {selectedDay}: Adventure Awaits! 🌟
                </h3>
                {currentDay?.weatherSummary && (
                  <div className="text-right">
                    <div className="text-sm text-blue-300">Weather</div>
                    <div className="text-white font-semibold">{currentDay.weatherSummary.condition}</div>
                  </div>
                )}
              </div>

              {/* Activities from actual data */}
              <div className="space-y-6">
                {currentDay?.activities?.map((activity: any) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl p-6 ${
                      activity.type === 'instagram' 
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-300/30' 
                        : 'bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-2">
                          {activity.title}
                        </h4>
                        <p className="text-blue-200 mb-3">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-blue-300">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {activity.duration}
                          </span>
                          <span className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            {activity.rating}/5
                          </span>
                          {activity.timing && (
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {activity.timing}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-lg font-bold text-green-400">
                          ₹{activity.cost.toLocaleString()}
                        </div>
                        <div className="text-sm text-blue-300">per person</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {activity.type === 'instagram' && (
                          <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-xs font-semibold">
                            📸 Instagram Spot
                          </span>
                        )}
                        {activity.type === 'adventure' && (
                          <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-semibold">
                            🏖️ Adventure
                          </span>
                        )}
                        {activity.type === 'food' && (
                          <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
                            🍽️ Cuisine
                          </span>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(activity)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                        >
                          View Details
                        </button>
                        {activity.type === 'food' ? (
                          <button 
                            onClick={() => handleMakeReservation(activity)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                          >
                            Make Reservation
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleMakeReservation(activity)}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                          >
                            Book Now
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Recommendations Section */}
        {itinerary.aiRecommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-blue-300/30"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Sparkles className="h-6 w-6 mr-3 text-yellow-400" />
              🤖 AI Travel Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {itinerary.aiRecommendations.map((rec: string, idx: number) => (
                <div key={idx} className="bg-white/10 rounded-xl p-4">
                  <p className="text-blue-100 text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* One-Click Booking Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-teal-500/20 backdrop-blur-lg rounded-3xl p-12 border border-amber-300/30">
            <h2 className="text-4xl font-bold text-white mb-6">
              ✨ Your Personalized Itinerary is Complete!
            </h2>
            <p className="text-xl text-slate-300/80 mb-8 max-w-2xl mx-auto">
              Every detail has been crafted just for you, <span className="text-amber-400/90 font-semibold capitalize">{userInput.personality}</span>! 
              Explore activities, view details, and make this trip <span className="text-rose-400/90 font-semibold">unforgettable</span>.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center justify-center bg-white/10 rounded-xl p-4">
                <Camera className="h-6 w-6 text-rose-400 mr-3" />
                <span className="text-white font-semibold">Instagram Spots</span>
              </div>
              <div className="flex items-center justify-center bg-white/10 rounded-xl p-4">
                <Plane className="h-6 w-6 text-amber-400 mr-3" />
                <span className="text-white font-semibold">Adventure Activities</span>
              </div>
              <div className="flex items-center justify-center bg-white/10 rounded-xl p-4">
                <Star className="h-6 w-6 text-teal-400 mr-3" />
                <span className="text-white font-semibold">Food Experiences</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-300/70 mt-4">
              📸 Instagram-optimized spots • 🏖️ Adventure activities • 🍽️ Food experiences • ✅ Personalized for you
            </p>
          </div>
        </motion.div>
      </div>

      <ChatbotPopover /> 
    </div>
  )
}
