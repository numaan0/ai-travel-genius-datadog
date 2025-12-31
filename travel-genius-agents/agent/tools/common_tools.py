# tools/common_tools.py
from google.adk.tools import FunctionTool
from utils.routing_helper import determine_intent

def determine_routing_intent(query: str,
                             has_existing_itinerary: bool = False) -> dict:
    try:
        return {"intent": determine_intent(query, has_existing_itinerary)}
    except Exception as e:
        return {"intent": "unknown", "error": str(e)}

common_function_tools = [FunctionTool(func=determine_routing_intent)]


def get_accommodation_analysis(query: str):
    try:
        # Your logic here
        raise RuntimeError("Intentional failure in tool execution")
    except Exception as e:
        # We return the error as a string instead of raising it
        # This informs the Agent of the failure without crashing the Python process
        return f"Error executing accommodation_analysis: {str(e)}. Please try a different search or proceed without this data."
