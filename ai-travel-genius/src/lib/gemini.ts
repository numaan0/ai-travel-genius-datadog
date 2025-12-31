// src/lib/gemini.ts - Your AI Powerhouse
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

export class TravelGenius {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  async generateItinerary(userInput: {
    destination: string
    budget: number
    days: number
    groupSize: number
    personality: string
    preferences: string[]
  }) {
    const prompt = this.buildPersonalityPrompt(userInput)
    
    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return this.parseItinerary(response.text())
    } catch (error) {
      console.error('AI Travel Genius error:', error)
      throw new Error('AI Travel Genius is temporarily overwhelmed! Try again.')
    }
  }

  private buildPersonalityPrompt(input: any): string {
    const personalityInsights = {
      adventure: "Focus on thrills, outdoor activities, unique experiences, and off-the-beaten-path destinations",
      luxury: "Emphasize premium accommodations, fine dining, exclusive experiences, and comfort",
      cultural: "Highlight museums, historical sites, local traditions, art galleries, and cultural immersion",
      party: "Include vibrant nightlife, social events, beach parties, music venues, and entertainment"
    }

    return `
🤖 AI TRAVEL GENIUS - ELITE ITINERARY CREATOR 🤖

USER PROFILE:
- Destination: ${input.destination}
- Budget: ₹${input.budget}
- Duration: ${input.days} days
- Group Size: ${input.groupSize} people
- Travel Personality: ${input.personality}
- Interests: ${input.preferences.join(', ')}

PERSONALITY INSIGHT: ${personalityInsights[input.personality as keyof typeof personalityInsights]}

MISSION: Create an INSANELY detailed, personalized itinerary that will:
✅ Maximize every rupee of their budget with smart allocation (40% accommodation, 30% activities, 20% transport, 10% food)
✅ Auto-detect Instagram-worthy photo spots with optimal lighting times
✅ Categorize activities: Adventure 🏖️, Food 🍽️, Instagram 📸
✅ Provide local insider recommendations
✅ Balance must-see attractions with hidden gems
✅ Consider weather, timing, and logistics
✅ Include realistic travel times and costs

OUTPUT FORMAT (STRICT JSON):
{
  "tripTitle": "Epic 7-Day Adventure in Paris",
  "totalEstimatedCost": 45000,
  "costBreakdown": {
    "accommodation": 18000,
    "activities": 13500,
    "transport": 9000,
    "food": 4500
  },
  "dailyPlans": [
    {
      "day": 1,
      "date": "2025-01-15",
      "theme": "Arrival & City Center Exploration",
      "activities": [
        {
          "time": "10:00 AM",
          "name": "Eiffel Tower Visit",
          "description": "Iconic Paris landmark with stunning city views",
          "duration": "2 hours",
          "cost": 1500,
          "location": "Champ de Mars, 7th arrondissement",
          "instagramSpot": true,
          "instagramBestTime": "Golden hour (6-7 PM) for best lighting",
          "category": "Adventure",
          "bookingRequired": true,
          "tips": ["Book skip-the-line tickets", "Best photos from Trocadéro"]
        }
      ],
      "meals": [
        {
          "time": "1:00 PM",
          "name": "Le Comptoir du 7ème",
          "type": "Lunch",
          "cuisine": "French Bistro",
          "cost": 800,
          "location": "Near Eiffel Tower",
          "speciality": "Traditional French onion soup"
        }
      ],
      "accommodation": {
        "name": "Hotel des Grands Boulevards",
        "cost": 3500,
        "location": "2nd arrondissement",
        "rating": 4.5,
        "amenities": ["Free WiFi", "Breakfast", "Central location"]
      },
      "transport": [
        {
          "from": "Airport",
          "to": "Hotel",
          "method": "RER Train + Metro",
          "cost": 200,
          "duration": "45 minutes"
        }
      ],
      "dailyCost": 6000,
      "weatherNote": "Mild weather, perfect for walking",
      "localTips": ["Parisians appreciate basic French greetings", "Dinner starts after 7 PM"]
    }
  ],
  "bookingLinks": [],
  "packingList": ["Comfortable walking shoes", "Portable charger", "Universal adapter"],
  "emergencyInfo": {
    "embassy": "Indian Embassy contact details",
    "localEmergency": "112 (European emergency number)",
    "hospitals": ["Hôpital Américain", "Hôpital Saint-Louis"]
  },
  "budgetOptimizationTips": [
    "Book museums together for combo discounts",
    "Use metro day passes for unlimited travel",
    "Eat lunch at bistros, dinner at casual places"
  ],
  "hiddenGems": [
    "Secret rooftop bar at Printemps Haussmann",
    "Free organ concerts at Saint-Sulpice",
    "Local market at Marché aux Enfants Rouges"
  ]
}

CRITICAL: Return ONLY valid JSON. No markdown, no explanations, no additional text.
Make it EPIC, DETAILED, and perfectly matched to their ${input.personality} personality! 🔥
    `
  }

private parseItinerary(aiResponse: string) {
  try {
    // Use unicode escapes to avoid backtick parsing issues
    const cleanedResponse = aiResponse
      .replace(/\u0060{3}json/g, '')  // \u0060 is unicode for backtick
      .replace(/\u0060{3}/g, '')     // Matches exactly 3 backticks
      .trim()
    
    return JSON.parse(cleanedResponse)
  } catch (error) {
    console.error('JSON parsing error:', error)
    return this.extractJSONFromText(aiResponse)
  }
}






  private extractJSONFromText(text: string) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('JSON extraction failed:', error);
    }
    
    // Ultimate fallback
    return {
      tripTitle: "Amazing Travel Experience",
      totalEstimatedCost: 50000,
      dailyPlans: [{
        day: 1,
        theme: "Exciting Adventure",
        activities: [{
          name: "Explore the destination",
          description: "Discover amazing places and experiences",
          cost: 2000,
          instagramSpot: true
        }]
      }],
      bookingLinks: []
    }
  }
}

export const travelGenius = new TravelGenius()
