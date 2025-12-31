import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google.adk.cli.fast_api import get_fast_api_app

# 1. Create the FastAPI app and load the ADK app
app = FastAPI(title="Travel Genius Agents API")



# 2. Configure CORS using FastAPI's standard middleware
# Replace "*" with your specific frontend origin(s) for better security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development. Use a list like ["http://localhost:3000"] in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Get the ADK FastAPI application
# Set your agents directory path here
agents_dir = "./agent"  # Or the absolute path to your agents directory
adk_app = get_fast_api_app(agents_dir=agents_dir, web=True, allow_origins=["*"])

app.mount("/", adk_app)

@app.get("/health")
async def health():
    return {"status": "healthy"}