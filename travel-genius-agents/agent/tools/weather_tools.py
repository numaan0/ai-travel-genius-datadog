# tools/weather_tools.py
import json, asyncio
from google.adk.tools import FunctionTool
from utils.weather_helper import (
    extract_destination_from_text, analyze_weather_suitability
)
from services.weather_service import weather_service

# ---------- CACHE FOR WEATHER DATA (PREVENTS DUPLICATE CALLS) ----------
_weather_cache = {}

def _get_cache_key(destination: str, start_date: str, duration_days: int) -> str:
    """Generate cache key from parameters"""
    return f"{destination}:{start_date}:{duration_days}"

# ---------- WRAPPED FUNCTIONS ----------
def extract_destination_from_query(query: str) -> dict:
    return {"destination": extract_destination_from_text(query)}

def get_weather_analysis(destination: str,
                         start_date: str,
                         duration_days: int) -> dict:
    """
    Get weather analysis with caching to prevent duplicate API calls.
    Returns cached result if same parameters were used recently.
    """
    # Check cache first
    cache_key = _get_cache_key(destination, start_date, duration_days)
    if cache_key in _weather_cache:
        print(f"[Cache Hit] Returning cached weather data for {destination}")
        return _weather_cache[cache_key]
    
    # Cache miss - fetch new data
    try:
        print(f"[Cache Miss] Fetching weather data for {destination}")
        data = asyncio.get_event_loop().run_until_complete(
            weather_service.get_weather_summary_for_dates(
                destination, start_date, duration_days)
        )
        result = analyze_weather_suitability(data, destination)
        
        # Cache the result
        _weather_cache[cache_key] = result
        print(f"[Cache Store] Cached weather data for {destination}")
        
        return result
    except Exception as e:
        error_result = {"destination": destination, "error": str(e)}
        # Don't cache errors
        return error_result

def get_current_weather_report(destination: str) -> dict:
    try:
        current  = asyncio.get_event_loop().run_until_complete(
            weather_service.get_current_weather(destination))
        summary  = asyncio.get_event_loop().run_until_complete(
            weather_service.get_weather_summary_for_dates(
                destination, start_date="", duration_days=7))
        return {
            "destination": destination,
            "current": current["current"],
            "daily_weather": summary["daily_weather"][:7],
            "overall_weather_score": summary["overall_weather_score"],
            "weather_alerts": summary["weather_alerts"],
            "success": True
        }
    except Exception as e:
        return {"success": False, "error": str(e), "destination": destination}

def optimize_schedule_for_weather(destination: str,
                                  activities_json: str,
                                  duration_days: int) -> dict:
    try:
        acts = json.loads(activities_json or "[]")
        forecast = asyncio.get_event_loop().run_until_complete(
            weather_service.get_forecast(destination, duration_days))
        for idx, act in enumerate(acts):
            if idx < len(forecast.get("forecastday", [])):
                day = forecast["forecastday"][idx]
                score = weather_service.get_weather_suitability_score(
                    day, act.get("type", "outdoor"))
                act["weather_score"] = score
        return {
            "success": True,
            "destination": destination,
            "optimized_schedule": acts
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

# ---------- TOOLSET ----------
weather_function_tools = [
    FunctionTool(func=extract_destination_from_query),
    FunctionTool(func=get_weather_analysis),
    FunctionTool(func=get_current_weather_report),
    FunctionTool(func=optimize_schedule_for_weather),
]
