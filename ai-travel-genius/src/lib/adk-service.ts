// src/lib/adk-service.ts
import axios from 'axios';

const ADK_API_URL = process.env.NEXT_PUBLIC_ADK_SERVICE_URL || "http://localhost:8000";

/**
 * Generate unique user ID
 */
function generateUserId(): string {
  return `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique session ID
 */
function generateSessionId(): string {
  return `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// TypeScript types for structured responses
export interface Activity {
  id: string;
  title: string;
  description: string;
  cost: number;
  duration: string;
  type: "adventure" | "food" | "cultural" | "instagram" | "attraction" | "transport";
  timing: string;
  rating: number;
}

export interface DailyWeatherSummary {
  condition: string;
  outdoorScore: number;
  indoorScore: number;
  recommendations: string[];
}

export interface DailyPlan {
  day: number;
  activities: Activity[];
  weatherSummary: DailyWeatherSummary;
}

export interface OverallWeatherSummary {
  overallScore: number;
  suitableForOutdoor: boolean;
  alerts: string[];
  recommendations: string[];
}

export interface TravelItinerary {
  tripTitle: string;
  totalEstimatedCost: number;
  dailyPlans: DailyPlan[];
  weatherOptimized: boolean;
  sustainabilityScore: number;
  weatherSummary: OverallWeatherSummary;
  aiRecommendations: string[];
  instagramSpots: string[];
  generatedBy: string;
  generatedAt: string;
}

export interface ItineraryAssistantResponse {
  answer: string;
  day: number | null;
  activity: string | null;
  emoji: string;
}

// SSE Event types (kept for askQuestionStream which is still used)
export interface SSEEvent {
  type: string;
  data: any;
  id?: string;
}

export interface StreamCallbacks {
  onChunk?: (chunk: any) => void;
  onProgress?: (progress: string) => void;
  onStateUpdate?: (state: any) => void;
  onComplete?: (result: any) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal; // Add abort signal for cleanup
}

export const adkService = {

  /**
   * Ask question using simple /run endpoint (non-streaming)
   */
  async askQuestionStream(
    userInput: string,
    callbacks: StreamCallbacks
  ): Promise<ItineraryAssistantResponse | null> {
    try {
      // Check if aborted
      if (callbacks.signal?.aborted) {
        return null;
      }

      callbacks.onProgress?.('💬 Processing your question...');

      // Generate unique user and session IDs for this call
      const userId = generateUserId();
      const sessionId = generateSessionId();

      const adkPayload = {
        appName: 'agent',
        userId: userId,
        sessionId: sessionId,
        newMessage: {
          role: "user",
          parts: [{ text: userInput }]
        }
      };

      const controller = new AbortController();
      if (callbacks.signal) {
        callbacks.signal.addEventListener('abort', () => controller.abort());
      }

      const response = await axios.post(
        `${ADK_API_URL}/run`,
        adkPayload,
        { 
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        }
      );

      // Check if aborted
      if (callbacks.signal?.aborted) {
        return null;
      }

      callbacks.onProgress?.('✅ Response received!');

      // Try to extract structured response from state first
      if (response.data?.state?.assistant_response) {
        const result = response.data.state.assistant_response;
        callbacks.onComplete?.(result);
        return result;
      }

      // Fallback: Parse from response
      const parsed = this.parseAdkJson(response.data);
      
      if (parsed && (parsed.answer || parsed.day !== undefined)) {
        callbacks.onComplete?.(parsed);
        return parsed;
      }

      throw new Error('No valid structured response received from agent');
    } catch (error: any) {
      // Don't show error if aborted
      if (callbacks.signal?.aborted || error.name === 'AbortError') {
        return null;
      }
      console.error('Error calling ADK service:', error);
      callbacks.onError?.(error);
      throw new Error('Could not get response. Please try again.');
    }
  },

  /**
   * Generate itinerary (non-streaming)
   */
  async generateItinerary(userInput: any): Promise<TravelItinerary> {
    try {
      // Generate unique user and session IDs for this call
      const userId = generateUserId();
      const sessionId = generateSessionId();

      // Create session first
      await this.getSession(userId, sessionId);

      const query = `Create a complete ${userInput.days}-day travel itinerary for ${userInput.destination} with budget ₹${userInput.budget} for ${userInput.groupSize} ${userInput.personality} ${userInput.preferences && userInput.preferences.length > 0? userInput.preferences.join(", "): "no specific preferences"}.`;

      const adkPayload = {
        appName: 'agent',
        userId: userId,
        sessionId: sessionId,
        newMessage: {
          role: "user",
          parts: [{ text: query }]
        }
      };

      const response = await axios.post(
        `${ADK_API_URL}/run`,
        adkPayload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Try to extract structured response from state first
      if (response.data?.state?.travel_itinerary) {
        return response.data.state.travel_itinerary;
      }

      // Fallback: Extract JSON from response text
      const jsonResponse = this.extractStructuredResponseFromAdk(response.data);
      
      if (!jsonResponse) {
        throw new Error('No valid structured response received from agent');
      }

      return jsonResponse;
    } catch (error) {
      console.error('Error calling ADK service:', error);
      throw new Error('Could not generate itinerary. Please try again.');
    }
  },

  async getSession(userId: string, sessionId: string) {
    try {
      const response = await axios.post(
        `${ADK_API_URL}/apps/agent/users/${userId}/sessions/${sessionId}`,
        { state: { key1: "value1", key2: 42 } },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
    }
  },

  /**
   * Extract structured response from ADK response
   * Prioritizes state.travel_itinerary or state.assistant_response
   */
  extractStructuredResponseFromAdk(adkResponse: any): TravelItinerary | null {
    try {
      // Check for structured output in state
      if (adkResponse?.state?.travel_itinerary) {
        return adkResponse.state.travel_itinerary;
      }

      const responseArray = Array.isArray(adkResponse) ? adkResponse : [adkResponse];
      
      // Look for the final text response
      for (const turn of responseArray.reverse()) {
        if (turn.content?.parts) {
          for (const part of turn.content.parts) {
            if (part.text) {
              const extracted = this.extractStructuredResponse(part.text);
              if (extracted) {
                return extracted;
              }
            }
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Failed to extract structured response:', error);
      return null;
    }
  },

  /**
   * Extract structured response from text (JSON parsing)
   */
  extractStructuredResponse(text: string): TravelItinerary | null {
    try {
      const cleanText = text.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Validate it's a TravelItinerary
        if (parsed.dailyPlans && Array.isArray(parsed.dailyPlans)) {
          return parsed as TravelItinerary;
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Legacy method: Ask question (non-streaming)
   * Delegates to askQuestionStream if callbacks provided, otherwise uses /run endpoint
   */
  async askQuestion(userInput: string, callbacks?: StreamCallbacks): Promise<ItineraryAssistantResponse> {
    // If callbacks provided, use the stream version (which now uses /run)
    if (callbacks) {
      const result = await this.askQuestionStream(userInput, callbacks);
      if (!result) {
        throw new Error('No valid structured response received from agent');
      }
      return result;
    }

    // Otherwise, use /run endpoint directly
    try {
      // Generate unique user and session IDs for this call
      const userId = generateUserId();
      const sessionId = generateSessionId();

      const adkPayload = {
        appName: 'agent',
        userId: userId,
        sessionId: sessionId,
        newMessage: {
          role: "user",
          parts: [{ text: userInput }]
        }
      };

      const response = await axios.post(
        `${ADK_API_URL}/run`,
        adkPayload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Try to extract structured response from state first
      if (response.data?.state?.assistant_response) {
        return response.data.state.assistant_response;
      }

      // Fallback: Parse from response
      const parsed = this.parseAdkJson(response.data);
      
      if (parsed && (parsed.answer || parsed.day !== undefined)) {
        return parsed as ItineraryAssistantResponse;
      }

      throw new Error('No valid structured response received from agent');
    } catch (error: any) {
      console.error('Error calling ADK service:', error);
      throw new Error('Could not get response. Please try again.');
    }
  },

  /**
   * Parse ADK JSON response (legacy support)
   */
  parseAdkJson(adk: any): ItineraryAssistantResponse | null {
    try {
      // Check for structured response in state
      if (adk?.state?.assistant_response) {
        return adk.state.assistant_response;
      }

  const arr = Array.isArray(adk) ? adk : [adk];
  const text = arr[arr.length - 1]?.content?.parts?.[0]?.text;
  
  if (!text) return null;
  
      // Try JSON first
  try {
        const parsed = JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, ''));
        if (parsed.answer || parsed.day !== undefined) {
          return parsed as ItineraryAssistantResponse;
        }
  } catch {
        // Fallback to plain text
        return {
          answer: text.trim(),
          day: null,
          activity: null,
          emoji: '💬'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Failed to parse ADK JSON:', error);
      return null;
    }
  }
};
