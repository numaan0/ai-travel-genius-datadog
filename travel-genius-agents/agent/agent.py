from google.adk.agents.llm_agent import Agent
from google.adk.agents import SequentialAgent
import sys
import os
from dotenv import load_dotenv
import nest_asyncio
import atexit
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
from google.adk.tools import google_search_tool


nest_asyncio.apply()
load_dotenv()

# Add project root to Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)


from toolbox_core import ToolboxSyncClient

from ddtrace.llmobs import LLMObs
from ddtrace import tracer, config
import os

# Enable LLMObs for enhanced agent observability
LLMObs.enable(
    ml_app="travel-genius-agents",
    api_key=os.getenv("DD_API_KEY"),
    site=os.getenv("DD_SITE", "us5.datadoghq.com"),
    agentless_enabled=True,
    env=os.getenv("DD_ENV", "dev"),  
)

# Configure ddtrace for agent-level spans
try:
    config.service = "travel-genius-agents"
    config.env = os.getenv("DD_ENV", "dev")
    config.version = os.getenv("DD_VERSION", "1.0.0")
    
    # Enable LLM Observability in tracer config
  
    config._llmobs_enabled = True
    config._llmobs_ml_app = "travel-genius-agents"
    
    # Add global tags for better filtering in Datadog dashboard
    tracer.set_tags({
        "ml_app": "travel-genius-agents",
        "service": "travel-genius-agents",
        "component": "agent",
        "agent_type": "llm_agent",
        "deployment": os.getenv("DD_ENV", "dev"),
        "version": os.getenv("DD_VERSION", "1.0.0")
    })
except Exception as e:
    print(f"⚠️  Datadog configuration warning: {e}")







# Note: We're keeping it simple - only weather tool is used
# Other tool imports removed to simplify the setup

# ============================================
# PYDANTIC MODELS FOR STRUCTURED OUTPUT
# ============================================

class Activity(BaseModel):
    """Individual activity in the itinerary"""
    id: str = Field(description="Unique identifier for the activity")
    title: str = Field(description="Activity title with emoji")
    description: str = Field(description="Detailed description of the activity")
    cost: int = Field(description="Cost in local currency", ge=0)
    duration: str = Field(description="Duration of the activity (e.g., '3-4 hours')")
    type: Literal["adventure", "food", "cultural", "instagram", "relaxation", "shopping", "nightlife"] = Field(
        description="Type of activity"
    )
    timing: str = Field(description="Time slot for the activity (e.g., '9:00 AM - 1:00 PM')")
    rating: float = Field(description="Activity rating from 0.0 to 5.0", ge=0.0, le=5.0)

class DailyWeatherSummary(BaseModel):
    """Weather summary for a specific day"""
    condition: str = Field(description="Weather condition (e.g., 'Sunny', 'Partly Cloudy', 'Rainy')")
    outdoorScore: int = Field(description="Weather suitability score for outdoor activities (1-10)", ge=1, le=10)
    indoorScore: int = Field(description="Weather suitability score for indoor activities (1-10)", ge=1, le=10)
    recommendations: List[str] = Field(description="Weather-specific recommendations for the day")

class DailyPlan(BaseModel):
    """Daily plan with activities and weather summary"""
    day: int = Field(description="Day number", ge=1)
    activities: List[Activity] = Field(description="List of activities for the day (2-4 activities)", min_items=2, max_items=4)
    weatherSummary: DailyWeatherSummary = Field(description="Weather summary for this day")

class OverallWeatherSummary(BaseModel):
    """Overall weather summary for the entire trip"""
    overallScore: float = Field(description="Overall weather score (0.0-10.0)", ge=0.0, le=10.0)
    suitableForOutdoor: bool = Field(description="Whether weather is suitable for outdoor activities")
    alerts: List[str] = Field(description="Weather alerts or warnings", default_factory=list)
    recommendations: List[str] = Field(description="General weather recommendations for the trip")

class TravelItinerary(BaseModel):
    """Complete travel itinerary with structured data"""
    tripTitle: str = Field(description="Title of the trip itinerary")
    totalEstimatedCost: int = Field(description="Total estimated cost in local currency", ge=0)
    dailyPlans: List[DailyPlan] = Field(description="List of daily plans", min_items=1)
    weatherOptimized: bool = Field(description="Whether the itinerary is weather-optimized", default=True)
    sustainabilityScore: float = Field(description="Sustainability score (0.0-10.0)", ge=0.0, le=10.0)
    weatherSummary: OverallWeatherSummary = Field(description="Overall weather summary")
    aiRecommendations: List[str] = Field(description="AI-generated recommendations for the trip")
    instagramSpots: List[str] = Field(description="Instagram-worthy spots to visit", default_factory=list)
    generatedBy: str = Field(description="Name of the system that generated the itinerary", default="AI Travel Genius")
    generatedAt: str = Field(description="ISO 8601 timestamp when itinerary was generated")


# ============================================
# TOOLBOX CONNECTION WITH PROPER CLEANUP
# ============================================

toolbox_url = os.getenv("MCP_TOOLBOX_URL", "http://127.0.0.1:5000")
toolbox = None
travel_tools = []

def cleanup_toolbox():
    """Cleanup function called on exit"""
    global toolbox
    if toolbox:
        try:
            if hasattr(toolbox, 'close'):
                toolbox.close()
        except Exception:
            pass

# Register cleanup
atexit.register(cleanup_toolbox)

try:
    toolbox = ToolboxSyncClient(toolbox_url)
    print("✅ MCP Toolbox connection successful!")
    travel_tools = toolbox.load_toolset('travel_genius_toolset')
    print(f"✅ Loaded {len(travel_tools)} travel tools from toolbox")
except RuntimeError as e:
    print(f"⚠️  Warning: Failed to load travel tools (RuntimeError): {e}")
    print("   Continuing without toolbox tools. Agents will use local tools only.")
except Exception as e:
    print(f"⚠️  Warning: Failed to load travel tools: {type(e).__name__}: {e}")
    print("   Continuing without toolbox tools. Agents will use local tools only.")

# ============================================
# TOOL ORGANIZATION - SIMPLIFIED
# ============================================
#
# WEATHER TOOL STRATEGY: Only weather_agent calls the weather API
# - weather_agent: Has weather tool, fetches data ONCE, stores in context.state.weather_data
# - All other agents: Read weather data from context.state.weather_data (no tools needed)

# Import weather tool directly
from tools.weather_tools import get_weather_analysis
from google.adk.tools import FunctionTool
from tools.common_tools import get_accommodation_analysis

# Weather tool - ONLY for weather_agent
weather_tool = [FunctionTool(func=get_weather_analysis)]
accomation_tool = FunctionTool(func=get_accommodation_analysis)
gems_tool = google_search_tool.google_search

print(f"✅ Weather tool configured: Only weather_agent will call weather API")
print(f"✅ Other agents will read weather data from context.state.weather_data")

# ============================================
# SUB-AGENT DEFINITIONS
# ============================================

personality_agent = Agent(
    name="personality_analyzer",
    model="gemini-2.0-flash",
    description="Analyzes user personality quiz results and travel preferences",
    instruction="""
    You are a travel psychology expert who analyzes user quiz responses to determine their travel personality type.
    
    Personality Types to Identify:
    - HERITAGE: Loves historical sites, cultural experiences, museums, traditional accommodations
    - ADVENTURE: Seeks active experiences, outdoor activities, unique challenges, offbeat destinations  
    - CULTURAL: Wants authentic local interactions, community experiences, traditional festivals
    - PARTY: Enjoys nightlife, social experiences, vibrant cities, entertainment venues
    - LUXURY: Prefers premium experiences, comfort, exclusive services, high-end accommodations
    
    Weather Considerations (general guidance):
    - For ADVENTURE personalities: Emphasize good weather days for outdoor activities
    - For CULTURAL personalities: Mix indoor/outdoor based on weather
    - For HERITAGE personalities: Indoor alternatives during poor weather
    
    Focus on personality analysis based on user responses. Weather details will be handled by other agents.
    """,
    tools=[]  # No tools needed - pure personality analysis
)

budget_agent = Agent(
    name="budget_optimizer",
    model="gemini-2.0-flash", 
    description="Optimizes budget allocation with weather-aware contingency planning",
    instruction="""
    You are a travel finance expert who creates realistic budget allocations based on personality and destination data.
    
    **READ WEATHER DATA FROM CONTEXT:**
    - Read weather data from context.state.weather_data (provided by weather_agent)
    - DO NOT call any weather tools - use the data from context
    
    Budget Allocation by Personality:
    - HERITAGE: 40% transport, 35% accommodation, 20% cultural activities, 5% buffer
    - ADVENTURE: 35% transport, 25% accommodation, 35% activities/experiences, 5% buffer  
    - LUXURY: 30% transport, 45% accommodation, 20% premium experiences, 5% buffer
    - PARTY: 35% transport, 30% accommodation, 30% nightlife/entertainment, 5% buffer
    - CULTURAL: 40% transport, 30% accommodation, 25% authentic experiences, 5% buffer
    
    Weather Contingency (use weather data from context.state.weather_data):
    - Always allocate 3-5% extra for weather-related changes (indoor alternatives, transport delays)
    - Suggest flexible bookings during monsoon/winter seasons
    - Include indoor activity options within the cultural/entertainment budget
    """,
    tools=[]  # No tools - reads from context.state.weather_data
)


gems_agent = Agent(
    name="gems_discoverer",
    model="gemini-2.0-flash",
    description="Discovers authentic hidden gems with weather suitability",
    instruction="""
    You are a local travel expert.
    
    **CRITICAL BOUNDARY:**
    - Your `Google Search_tool` is EXCLUSIVELY for finding hidden gems, local workshops, and off-the-beaten-path experiences.
    - NEVER use `Google Search_tool` to check the weather. 
    - You MUST use the weather data already present in `context.state.weather_data`.
    
    **Your Workflow:**
    1. Read the weather from `context.state.weather_data`.
    2. Search for hidden gems using your tool.
    3. Filter the search results based on the weather (e.g., if it's raining, discard the rooftop suggestions and keep the indoor workshop results).
    4. Present the final list to the user, explaining how each gem fits the current weather.
    
    **Focus Areas:**
    - Community-based tourism.
    - Local interactions.
    - Weather-appropriate transitions (e.g., "Since the morning is hot, we start at this shaded pottery studio...").
    """,
    tools=[gems_tool]
)


sustainability_agent = Agent(
    name="sustainability_advisor",
    model="gemini-2.0-flash",
    description="Evaluates environmental impact including weather-related carbon footprint",
    instruction="""
    You are an eco-travel expert focused on sustainable and responsible tourism practices.
    
    **READ WEATHER DATA FROM CONTEXT:**
    - Read weather data from context.state.weather_data (provided by weather_agent)
    - DO NOT call any weather tools - use the data from context
    
    Your Responsibilities:
    1. Estimate transport carbon footprints based on destination and travel mode
    2. Prioritize accommodations and activities with high sustainability scores
    3. Calculate total trip carbon footprint including weather-related adjustments
    4. Recommend off-peak travel to reduce environmental impact
    
    Weather Sustainability Factors (use context.state.weather_data):
    - Assess seasonal travel patterns from weather data
    - Consider weather-related transport delays and alternatives
    - Factor in energy consumption during extreme weather
    - Encourage shoulder season travel to reduce overcrowding
    """,
    tools=[]  
)

accommodation_agent = Agent(
    name="accommodation_specialist", 
    model="gemini-2.0-flash",
    description="Finds perfect accommodations with weather-appropriate amenities",
    instruction="""
    You are an accommodation expert who matches travelers with weather-appropriate places to stay.
    
    **READ WEATHER DATA FROM CONTEXT:**
    - Read weather data from context.state.weather_data (provided by weather_agent)
    
    Weather-Aware Selection (based on context.state.weather_data):
    - Monsoon season: Properties with covered parking, good drainage, backup power
    - Summer: Air conditioning, pools, shaded outdoor areas
    - Winter: Heating, warm amenities, indoor recreation
    - Year-round: Flexible common areas for weather changes
    
    Provide general accommodation recommendations based on destination, weather (from context), and personality
    
    Match accommodation types to personality AND weather:
    - ADVENTURE + Good weather: Eco-lodges, outdoor-focused properties
    - ADVENTURE + Poor weather: Properties with indoor activities, gyms
    - LUXURY: Climate-controlled comfort with weather-resistant amenities
    
    Always explain how each property handles different weather conditions.
    """,
    tools=[accomation_tool]  
)

# Create weather agent with Datadog instrumentation
weather_agent = Agent(
    name="weather_planner",
    model="gemini-2.0-flash",
    description="Fetches weather data and stores it in context for other agents to use",
    instruction="""
    You are the Weather Data Provider - your ONLY job is to fetch weather data and return it EXACTLY as received.
    
    **YOUR SINGLE RESPONSIBILITY:**
    1. Call get_weather_analysis tool ONCE with destination, start_date, and duration_days from user request
    2. Copy the EXACT response you receive from get_weather_analysis tool
    3. Return ONLY that response - nothing else
    4. DO NOT add any text, explanations, or formatting
    
    **CRITICAL:**
    - Call get_weather_analysis EXACTLY ONCE
    - After receiving the tool response, output ONLY the tool's response data
    - DO NOT wrap it in text, DO NOT add "Here is the weather data:", DO NOT add anything
    - Simply output the raw tool response - it will be automatically stored in context.state.weather_data
    - The tool response is a dictionary/JSON - output it exactly as received
    
    **EXAMPLE:**
    If get_weather_analysis returns:
    {"destination": "Goa", "weather_suitable": true, "weather_score": 8.0, ...}
    
    Then your output should be EXACTLY:
    {"destination": "Goa", "weather_suitable": true, "weather_score": 8.0, ...}
    
    DO NOT output: "Here is the weather data: {...}" or any other text.
    """,
    tools=weather_tool,  # Only weather agent has the tool
    output_key="weather_data"  # Automatically stores in context.state.weather_data
)

# ============================================
# MAIN AGENTS - ITINERARY GENERATOR & ASSISTANT
# ============================================

itinerary_generator = Agent(
    name="itinerary_generator",
    model="gemini-2.0-flash",
    description="AI-powered travel planner that returns structured itineraries",
    instruction="""You are the Travel Genius - an expert AI travel planner who creates detailed, weather-optimized itineraries.

**EXECUTION FLOW:**
STEP 1: Read weather data from context.state.weather_data (already provided by weather_planner in previous step)
STEP 2: Generate the complete itinerary using:
   - Weather data from context.state.weather_data (parse the JSON string to extract daily_forecast)
   - User requirements from the original request (destination, duration, budget, preferences)
   - Your travel expertise
STEP 3: Return the structured TravelItinerary output - execution stops here

**READING WEATHER DATA:**
- Weather data is stored in context.state.weather_data as a JSON string by weather_planner agent
- Parse the JSON string to extract: daily_forecast, suitability_scores (outdoor, indoor, beach), recommendations
- DO NOT call any weather tools directly - use the weather data from context.state.weather_data
- The weather data structure contains:
  * daily_forecast: array with date, condition, suitability_scores (outdoor, indoor, beach), recommendations
  * weather_score: overall score (0-10)
  * weather_suitable: boolean
  * recommendations: general recommendations

**CRITICAL RULES:**
- ALWAYS include 2-4 activities per day (prefer 3-4 for better experiences)
- Match activities to weather: outdoor activities on high outdoorScore days (7-10), indoor on low days (1-4)
- Create SPECIFIC activities with real place names when possible
- Vary activity types: mix adventure, food, cultural, instagram, relaxation
- Use weather data to optimize timing (early morning for hot weather, afternoon for indoor activities)
- Calculate totalEstimatedCost based on user budget and duration
- Set sustainabilityScore based on transport choices and activity types (8-10 for eco-friendly, 5-7 for standard)

**ACTIVITY GUIDELINES:**
- Morning (9 AM - 1 PM): Outdoor activities if weather permits, or cultural/indoor alternatives
- Afternoon (1:30 PM - 5 PM): Food experiences, shopping, or indoor cultural sites
- Evening (6 PM - 9 PM): Instagram spots, nightlife, or cultural shows based on weather

**WEATHER OPTIMIZATION (use weather data from context.state.weather_data):**
- outdoorScore 8-10: Prioritize beach, hiking, outdoor markets, water sports
- outdoorScore 5-7: Mix outdoor and indoor, use morning/evening for outdoor
- outdoorScore 1-4: Focus on museums, galleries, indoor markets, cultural centers, shows

**COST ALLOCATION:**(use data from the Budget allocation agent)

**IMPORTANT:**
- The output_schema enforces termination - once you provide structured TravelItinerary, execution completes
- Generate itinerary directly using weather data from context - no tool calls or agent transfers needed
- DO NOT transfer to budget_optimizer or any other agent - just generate the itinerary""",
    tools=[],  # No tools - reads weather from context.state.weather_data
    output_schema=TravelItinerary,  # This enforces structured output and prevents loops
    output_key="itinerary"
)

# ============================================
# ROOT AGENT - SEQUENTIAL CHAIN
# ============================================

# Create SequentialAgent chain: weather_planner -> itinerary_generator
# Wrap with Datadog workflow tracing
root_agent = SequentialAgent(
    name="travel_genius",
    description="Sequential pipeline for travel itinerary generation with weather optimization",
    sub_agents=[
        weather_agent,
        personality_agent,
        budget_agent,
        gems_agent,accommodation_agent,sustainability_agent,
        itinerary_generator   # Step 2: Generate itinerary using weather data (output_key: itinerary)
    ]
)

# Configure Datadog to track sub-agents
# According to Datadog docs, Google ADK should automatically create spans for sub-agents
# The agent names will appear in traces. If not visible, check:
# 1. APM traces view (not just LLM Observability)
# 2. Ensure DD_API_KEY and DD_SITE are correct
# 3. Check trace sampling settings
try:
    # Add tags to help identify agents in traces
    with tracer.trace("travel_genius.workflow", service="travel-genius-agents") as span:
        span.set_tag("workflow.name", "travel_itinerary_generation")
        span.set_tag("workflow.type", "sequential_agent")
        span.set_tag("sub_agents", "weather_planner,itinerary_generator")
    
    print("✅ Datadog LLM Observability configured for sub-agent tracking")
    print("   - Check APM > Traces to see sub-agent spans")
    print("   - Sub-agents: weather_planner, itinerary_generator")
except Exception as e:
    print(f"⚠️  Datadog tagging warning: {e}")

print("✅ All agents configured successfully!")
print(f"   - Root agent: {root_agent.name} (SequentialAgent)")
print(f"   - Sequential chain: weather_planner -> itinerary_generator")
print("🚀 Travel Genius AI system ready!")