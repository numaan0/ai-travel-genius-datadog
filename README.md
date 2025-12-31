# 🌍 Travel Genius

**AI-powered multi-agent travel planner with full observability using Datadog**

An intelligent travel planning platform that uses Google ADK (Agent Development Kit) with a sequential multi-agent architecture to create personalized, weather-optimized travel itineraries. Built with Next.js frontend, FastAPI backend, and comprehensive Datadog LLM Observability.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Multi-Agent System](#multi-agent-system)
- [Datadog Observability](#datadog-observability)
- [Traffic Generator](#traffic-generator)
- [Deployment](#deployment)
- [License](#license)

---

## 🎯 Overview

Travel Genius is an AI-powered travel planning platform that leverages Google's Agent Development Kit (ADK) to orchestrate multiple specialized AI agents. The system creates personalized travel itineraries by:

- **Analyzing user preferences** through personality quizzes
- **Fetching real-time weather data** for optimal activity planning
- **Discovering hidden gems** using Google Search
- **Optimizing budgets** based on travel personality
- **Generating structured itineraries** with weather-optimized activities
- **Providing full observability** through Datadog LLM Observability

The platform consists of a modern Next.js frontend and a FastAPI backend powered by Google ADK's SequentialAgent architecture.

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Trip Planner │  │  Dashboard   │  │  Chatbot     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                  │
└────────────────────────────┼──────────────────────────────────┘
                             │
                             │ HTTP/REST API
                             │
┌────────────────────────────┼──────────────────────────────────┐
│                    Backend (FastAPI)                          │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         Google ADK SequentialAgent Chain             │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │    │
│  │  │   Weather    │→ │ Personality  │→ │  Budget  │  │    │
│  │  │   Planner    │  │   Analyzer   │  │ Optimizer│  │    │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │    │
│  │         │                  │                  │       │    │
│  │         └──────────────────┼──────────────────┘       │    │
│  │                            │                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │    │
│  │  │ Hidden Gems  │→ │Accommodation │→ │Sustainability│  │    │
│  │  │  Discoverer  │  │  Specialist  │  │  Advisor  │  │    │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │    │
│  │                            │                          │    │
│  │                            ↓                          │    │
│  │                  ┌──────────────────┐                │    │
│  │                  │ Itinerary        │                │    │
│  │                  │ Generator        │                │    │
│  │                  └──────────────────┘                │    │
│  └──────────────────────────────────────────────────────┘    │
│                            │                                  │
│                            ↓                                  │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         Datadog LLM Observability                    │    │
│  │  • Agent Traces  • Token Usage  • Latency Metrics    │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input** → Frontend collects travel preferences, destination, budget, duration
2. **API Request** → Frontend sends request to FastAPI backend
3. **Sequential Agent Chain** → Agents execute in order:
   - `weather_planner` → Fetches weather data
   - `personality_analyzer` → Analyzes user personality
   - `budget_optimizer` → Allocates budget
   - `gems_discoverer` → Finds hidden gems via Google Search
   - `accommodation_specialist` → Recommends accommodations
   - `sustainability_advisor` → Calculates sustainability score
   - `itinerary_generator` → Creates final itinerary
4. **Response** → Structured itinerary returned to frontend
5. **Observability** → All agent interactions traced in Datadog

---

## ✨ Features

### 🎨 Frontend Features

- **Interactive Trip Planner** with personality quiz
- **Real-time Itinerary Generation** with progress tracking
- **AI Chatbot** for itinerary questions
- **Trip Dashboard** to view saved trips
- **Booking System** with payment integration (Razorpay)
- **Responsive Design** with modern UI/UX
- **Multi-language Support** (Next-intl)

### 🤖 Backend Features

- **Multi-Agent Architecture** using Google ADK SequentialAgent
- **Weather Integration** via weather API
- **Google Search Integration** for hidden gems discovery
- **Structured Output** using Pydantic models
- **Session Management** with unique user/session IDs
- **Error Handling** and graceful degradation

### 📊 Observability Features

- **Full Trace Visibility** in Datadog 
- **LLM Observability** for agent performance
- **Custom Monitors** for latency, token usage, error rates
- **Traffic Simulation** for testing monitors
- **Dashboard** for real-time metrics

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.5+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 19, Tailwind CSS 4
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **State Management**: React Hooks
- **Authentication**: NextAuth.js + Firebase
- **Payment**: Razorpay
- **HTTP Client**: Axios

### Backend

- **Framework**: FastAPI
- **Language**: Python 3.11+
- **AI Framework**: Google ADK (Agent Development Kit)
- **LLM**: Google Gemini 2.0 Flash
- **Observability**: Datadog ddtrace + LLMObs
- **Tools**: Google Search API, Weather API
- **Database**: PostgreSQL (Cloud SQL)

### Infrastructure

- **Frontend Hosting**: Netlify/Vercel
- **Backend Hosting**: Google Cloud Run
- **Monitoring**: Datadog
- **CI/CD**: GitHub Actions

---

## 📁 Project Structure

```
GoogleHackathon/
├── ai-travel-genius/              # Next.js Frontend
│   ├── src/
│   │   ├── app/                   # Next.js App Router pages
│   │   │   ├── page.tsx           # Home page
│   │   │   ├── plan-trip/         # Trip planner
│   │   │   ├── dashboard/         # User dashboard
│   │   │   └── api/               # API routes
│   │   ├── components/            # React components
│   │   │   ├── features/          # Feature components
│   │   │   │   ├── trip-planner/  # Itinerary generation
│   │   │   │   ├── booking/       # Booking forms
│   │   │   │   └── trip/          # Trip display
│   │   │   └── layout/            # Layout components
│   │   ├── lib/                   # Utilities
│   │   │   ├── adk-service.ts     # ADK API client
│   │   │   ├── firebase.ts        # Firebase config
│   │   │   └── gemini.ts          # Gemini client
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── types/                 # TypeScript types
│   │   └── constants/             # App constants
│   └── package.json
│
├── travel-genius-agents/          # FastAPI Backend
│   ├── agent/
│   │   ├── agent.py               # Main agent definitions
│   │   ├── tools/                 # Agent tools
│   │   │   ├── weather_tools.py   # Weather API
│   │   │   ├── common_tools.py    # Common utilities
│   │   │   └── destination_tools.py
│   │   ├── services/              # Business logic
│   │   │   ├── weather_service.py
│   │   │   └── dynamic_ingestion_service.py
│   │   └── utils/                  # Helper functions
│   ├── app.py                     # FastAPI application
│   └── requirements.txt
│
├── datadog/                       # Datadog Configuration
│   ├── monitors/                  # Alert monitors
│   │   ├── high_llm_response_latency.json
│   │   ├── high_token_usage.json
│   │   ├── high_llm_rate.json
│   │   └── burn_alert.json
│   └── dashboard/                 # Dashboard configs
│
├── traffic_generator/             # Load Testing
│   ├── traffic_generator.sh       # Traffic simulation script
│   └── README.md
│
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ and npm/yarn
- **Python** 3.11+
- **Google Cloud Account** (for ADK and Cloud Run)
- **Datadog Account** (for observability)
- **Environment Variables** (see below)

### Environment Variables

#### Frontend (`ai-travel-genius/.env.local`)

```bash
NEXT_PUBLIC_ADK_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
# ... other Firebase config
```

#### Backend (`travel-genius-agents/.env`)

```bash
DD_API_KEY=your_datadog_api_key
DD_SITE=us5.datadoghq.com
DD_ENV=dev
DD_VERSION=1.0.0
GOOGLE_MAPS_API_KEY=your_google_maps_key
WEATHER_API_KEY=your_weather_api_key
MCP_TOOLBOX_URL=http://127.0.0.1:5000  # Optional
```

### Installation

#### 1. Frontend Setup

```bash
cd ai-travel-genius
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

#### 2. Backend Setup

```bash
cd travel-genius-agents
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Backend runs on `http://localhost:8000`

#### 3. Verify Setup

```bash
# Test backend health
curl http://localhost:8000/health

# Should return: {"status":"healthy"}
```

---

## 🤖 Multi-Agent System

The system uses Google ADK's **SequentialAgent** to orchestrate specialized agents in a deterministic order:

### Agent Chain

1. **`weather_planner`** 🌤️

   - Fetches weather data for destination
   - Stores data in `context.state.weather_data`
   - Uses `get_weather_analysis` tool
2. **`personality_analyzer`** 🧠

   - Analyzes user quiz responses
   - Determines travel personality (Adventure, Luxury, Cultural, etc.)
   - No tools required
3. **`budget_optimizer`** 💰

   - Allocates budget based on personality
   - Adds weather contingency (3-5%)
   - Reads weather from context
4. **`gems_discoverer`** 💎

   - Uses Google Search to find hidden gems
   - Filters results based on weather
   - Focuses on authentic, offbeat experiences
5. **`accommodation_specialist`** 🏨

   - Recommends weather-appropriate accommodations
   - Uses `get_accommodation_analysis` tool
   - Matches to personality and weather
6. **`sustainability_advisor`** 🌱

   - Calculates carbon footprint
   - Provides sustainability score
   - Recommends eco-friendly options
7. **`itinerary_generator`** 📋

   - Generates final structured itinerary
   - Combines all agent outputs
   - Returns `TravelItinerary` Pydantic model

### Agent Communication

- **State Sharing**: Agents share data via `context.state`
- **Sequential Execution**: Each agent completes before next starts
- **Structured Output**: Final output uses Pydantic schema
- **Error Handling**: Graceful degradation if agents fail

---

## 📊 Datadog Observability

### Configuration

The backend is instrumented with Datadog LLM Observability:

```python
from ddtrace.llmobs import LLMObs

LLMObs.enable(
    ml_app="travel-genius-agents",
    api_key=os.getenv("DD_API_KEY"),
    site=os.getenv("DD_SITE", "us5.datadoghq.com"),
    agentless_enabled=True,
    env=os.getenv("DD_ENV", "dev"),
)
```

### What's Tracked

- **Agent Traces**: Full execution flow of all agents
- **LLM Calls**: Token usage, latency, costs
- **Tool Calls**: Weather API, Google Search, etc.
- **Errors**: Failed requests and exceptions
- **Performance**: Response times, throughput

### Monitors

Pre-configured monitors in `datadog/monitors/`:

- **High LLM Response Latency**: Alerts if p95 latency > 10s
- **High Token Usage**: Monitors token consumption
- **High LLM Rate**: Tracks request rate
- **Burn Alert**: Cost monitoring

## 🛡️ Traffic Generator

The traffic generator simulates real user traffic to test monitors and observability.

### Quick Start

```bash
cd traffic_generator
chmod +x traffic_generator.sh
./traffic_generator.sh
```

### What It Tests

The script sends 4 different travel scenarios:

- **Tokyo, Japan** - 1 day - ₹50,000 - Adventure
- **Dubai, UAE** - 2 days - ₹150,000 - Luxury
- **Kyoto, Japan** - 3 days - ₹80,000 - Cultural
- **Bangkok, Thailand** - 2 days - ₹60,000 - Party

### Output Example

```
✅ SUCCESS (3.2s)
📋 Trip: 🗾 Tokyo Adventure Escape
💵 Total Cost: 48500
📆 Days Planned: 1
🌱 Sustainability: 8.2/10

Total Requests: 4
✅ Successful: 4 (100.0%)
⏱️ Average Time: 3.5s per request
```

### Performance Targets

- **Success Rate**: Good ≥98%, Acceptable ≥95%
- **Latency**: Good <4s, Acceptable <6s
- **Error Rate**: Good <2%, Acceptable <5%

### Customization

Edit `traffic_generator.sh` to:

- Change API URL (line 21)
- Modify test scenarios
- Adjust request count
- Set custom timeouts

---

## 🚢 Deployment

### Frontend (Netlify/Vercel)

```bash
cd ai-travel-genius
npm run build
# Deploy to Netlify or Vercel
```

### Backend (Google Cloud Run)

```bash
cd travel-genius-agents
gcloud run deploy travel-genius-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars DD_API_KEY=xxx,DD_SITE=us5.datadoghq.com
```

### Environment Variables (Production)

Ensure these are set in Cloud Run:

- `DD_API_KEY`
- `DD_SITE`
- `DD_ENV=production`
- `GOOGLE_MAPS_API_KEY`
- `WEATHER_API_KEY`

---

## 📝 API Endpoints

### Backend (FastAPI)

- `GET /health` - Health check
- `POST /run` - Execute agent chain
- `POST /apps/{app}/users/{user}/sessions/{session}` - Create session
- POST /run
  payload: Sample
  {"appName":"agent","userId":"u_1767199996135_4gbt93u7l","sessionId":"s_1767199996135_hc7d5dsy8","newMessage":{"role":"user","parts":[{"text":"Create a complete 1-day travel itinerary for Tokyo, Japan with budget ₹90000 for 2 adventure no specific preferences."}]}}

### Frontend API Routes

- `POST /api/generate-itinerary` - Generate itinerary
- `POST /api/book-trip` - Book a trip

---

## 🔧 Troubleshooting

### Common Issues

| Problem                       | Solution                                                        |
| ----------------------------- | --------------------------------------------------------------- |
| Agents not visible in Datadog | Check APM Traces view, not just LLM Observability               |
| MCP Toolbox errors            | Application works without it - check `MCP_TROUBLESHOOTING.md` |
| High latency                  | Check weather API response times, agent execution order         |
| Token usage alerts            | Review agent instructions, optimize prompts                     |
| Frontend can't connect        | Verify `NEXT_PUBLIC_ADK_SERVICE_URL` matches backend URL      |

### Debug Mode

Enable debug logging:

```python
# Backend
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

## 📚 Additional Documentation

- **MCP Troubleshooting**: `travel-genius-agents/MCP_TROUBLESHOOTING.md`
- **Traffic Generator**: `traffic_generator/README.md`
- **Datadog Monitors**: `datadog/monitors/`

---

## 🎯 Key Features Highlights

### ✨ Smart Itinerary Generation

- Weather-optimized activities (outdoor on good days, indoor on bad days)
- Personality-matched experiences
- Budget-aware recommendations
- Hidden gems discovery via Google Search

### 🔍 Full Observability

- Every agent call traced
- Token usage monitored
- Latency tracked
- Error rates alerted

### 🚀 Production Ready

- Unique session/user IDs per request
- Error handling and graceful degradation
- Health checks
- Traffic simulation tools

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

Built for the **AI Partner Catatyst Hackathon 2025** with full trace-based observability.

**Organization**: `ai-travel-genius`

**Technologies**:

- Google ADK (Agent Development Kit)
- Google Gemini 2.0 Flash
- Datadog LLM Observability
- Next.js 15
- FastAPI

---

## 📞 Support

For issues or questions:

1. Check troubleshooting section
2. Review `MCP_TROUBLESHOOTING.md` for MCP issues
3. Check Datadog traces for agent execution flow
4. Review traffic generator output for API health

---

**Happy Travel Planning! 🌍✈️**
