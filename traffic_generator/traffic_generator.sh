#!/bin/bash

# ==============================================================================
# Travel Genius - Complete Traffic Generator (Dynamic Sessions)
# ==============================================================================
# Purpose: Generate test traffic with proper session initialization
# Usage: chmod +x traffic_generator.sh && ./traffic_generator.sh
# ==============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m'

# API Configuration
API_BASE_URL="${API_BASE_URL:-https://travel-genius-backend-308693249359.us-central1.run.app}"
APP_NAME="agent"

# Test API connectivity before starting
echo -e "${YELLOW}🔍 Testing API connectivity...${NC}"
if curl -s --max-time 5 "${API_BASE_URL}/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API is reachable${NC}"
else
    echo -e "${RED}⚠️  Warning: API health check failed. Continuing anyway...${NC}"
    echo -e "${YELLOW}   Make sure ${API_BASE_URL} is accessible${NC}"
fi
echo ""

# Statistics
TOTAL_REQUESTS=4
SUCCESSFUL=0
FAILED=0
TOTAL_TIME=0

echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       🌍 Travel Genius - Complete Traffic Generator          ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🎯 Base URL:${NC} $API_BASE_URL"
echo -e "${BLUE}📊 Requests:${NC} $TOTAL_REQUESTS (each with unique session)"
echo ""
echo -e "${YELLOW}Starting traffic generation with dynamic sessions...${NC}"
echo ""

# ==============================================================================
# Function: Generate random user and session IDs
# ==============================================================================
generate_ids() {
    local timestamp=$(date +%s%N | cut -b1-13)
    local random_suffix=$(cat /dev/urandom | tr -dc 'a-z0-9' | fold -w 8 | head -n 1)
    
    USER_ID="u_${timestamp}_${random_suffix}"
    SESSION_ID="s_${timestamp}_${random_suffix}"
    
    echo -e "${PURPLE}🆔 Generated IDs:${NC}"
    echo -e "   User: ${USER_ID}"
    echo -e "   Session: ${SESSION_ID}"
}

# ==============================================================================
# Function: Initialize session (POST with state)
# ==============================================================================
initialize_session() {
    echo -e "${YELLOW}   📝 Creating session...${NC}"
    
    local session_url="${API_BASE_URL}/apps/${APP_NAME}/users/${USER_ID}/sessions/${SESSION_ID}"
    
    # Create session with initial state
    local session_payload='{"state":{"key1":"value1","key2":42}}'
    
    local session_response=$(curl -s -w "\n%{http_code}" \
        -X POST "$session_url" \
        -H "Content-Type: application/json" \
        -d "$session_payload" \
        --max-time 10)
    
    local session_http_code=$(echo "$session_response" | tail -n 1)
    local session_body=$(echo "$session_response" | sed '$d')
    
    if [ "$session_http_code" -eq 200 ] || [ "$session_http_code" -eq 201 ]; then
        echo -e "${GREEN}   ✅ Session created successfully${NC}"
        if [ -n "$session_body" ] && [ "$session_body" != "{}" ]; then
            echo -e "${YELLOW}   📋 Session Response:${NC} $(echo "$session_body" | head -c 80)..."
        fi
        return 0
    else
        echo -e "${RED}   ❌ Session creation failed (HTTP $session_http_code)${NC}"
        if [ -n "$session_body" ]; then
            echo -e "${RED}   📄 Error:${NC} $(echo "$session_body" | head -c 100)"
        fi
        return 1
    fi
}

# ==============================================================================
# Function: Generate itinerary
# ==============================================================================
generate_itinerary() {
    local request_num=$1
    local destination=$2
    local duration=$3
    local budget=$4
    local travelers=$5
    local personality=$6
    local preferences=$7
    
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📍 Request #${request_num}/${TOTAL_REQUESTS}${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Generate fresh IDs for each request
    generate_ids
    
    # Step 1: Quick health check
    echo -e "${YELLOW}   🏥 Checking API health...${NC}"
    local health_check=$(curl -s -w "%{http_code}" --max-time 5 "${API_BASE_URL}/health" -o /dev/null 2>&1)
    if [ "$health_check" != "200" ]; then
        echo -e "${RED}   ⚠️  API health check failed (HTTP $health_check)${NC}"
        echo -e "${YELLOW}   Continuing anyway...${NC}"
    else
        echo -e "${GREEN}   ✅ API is healthy${NC}"
    fi
    echo ""
    
    # Step 2: Initialize session
    if ! initialize_session; then
        echo -e "${RED}   ⏭️  Skipping itinerary generation due to session failure${NC}"
        FAILED=$((FAILED + 1))
        echo ""
        return 1
    fi
    
    echo ""
    
    # Step 3: Create itinerary request text
    # Format: "Create a complete X-day travel itinerary for Destination with budget ₹Budget for X personality no specific preferences."
    if [ "$preferences" = "no specific preferences" ] || [ -z "$preferences" ]; then
        local request_text="Create a complete ${duration}-day travel itinerary for ${destination} with budget ₹${budget} for ${travelers} ${personality} no specific preferences."
    else
        local request_text="Create a complete ${duration}-day travel itinerary for ${destination} with budget ₹${budget} for ${travelers} ${personality} travelers with preferences for ${preferences}."
    fi
    
    # Step 4: Make itinerary request
    echo -e "${YELLOW}   🗺️  Generating itinerary:${NC}"
    echo -e "   Destination: $destination"
    echo -e "   Duration: $duration days"
    echo -e "   Budget: $budget"
    echo -e "   Travelers: $travelers $personality"
    echo -e "   Preferences: $preferences"
    echo ""
    
    local payload=$(cat <<EOF
{
  "appName": "${APP_NAME}",
  "userId": "${USER_ID}",
  "sessionId": "${SESSION_ID}",
  "newMessage": {
    "role": "user",
    "parts": [{
      "text": "${request_text}"
    }]
  }
}
EOF
)
    
    echo -e "${YELLOW}   ⏳ Sending to /run endpoint...${NC}"
    
    # Start timer
    local start_time=$(date +%s)
    
    # Make the API call with increased timeout
    # Use temp files to capture response and error separately
    local temp_response=$(mktemp 2>/dev/null || echo "/tmp/traffic_$$_response")
    local temp_stderr=$(mktemp 2>/dev/null || echo "/tmp/traffic_$$_stderr")
    
    curl -s -w "\n%{http_code}\n%{time_total}" \
        -X POST "${API_BASE_URL}/run" \
        -H "Content-Type: application/json" \
        -d "$payload" \
        --max-time 120 \
        --connect-timeout 10 \
        -o "$temp_response" \
        2>"$temp_stderr"
    
    local curl_exit_code=$?
    local response=$(cat "$temp_response" 2>/dev/null || echo "")
    local curl_error=$(cat "$temp_stderr" 2>/dev/null || echo "")
    
    # Clean up temp files
    rm -f "$temp_response" "$temp_stderr" 2>/dev/null
    
    local end_time=$(date +%s)
    local elapsed=$((end_time - start_time))
    TOTAL_TIME=$((TOTAL_TIME + elapsed))
    
    # Extract HTTP code, time, and response body
    # Response format: body\nhttp_code\ntime_total
    local http_code=$(echo "$response" | tail -n 2 | head -n 1)
    local curl_time=$(echo "$response" | tail -n 1)
    local response_body=$(echo "$response" | sed '$d' | sed '$d' 2>/dev/null)
    
    # Check if curl failed (http_code is 000 or empty, or curl exit code non-zero)
    if [ $curl_exit_code -ne 0 ] || [ -z "$http_code" ] || [ "$http_code" = "000" ]; then
        echo -e "${RED}   ❌ Connection Failed or Timeout (${elapsed}s)${NC}"
        echo -e "${YELLOW}   🔍 Debug Info:${NC}"
        echo -e "      URL: ${API_BASE_URL}/run"
        echo -e "      Timeout: 120s (actual: ${elapsed}s)"
        echo -e "      Curl Exit Code: $curl_exit_code"
        if [ -n "$curl_error" ]; then
            echo -e "      Curl Error: $(echo "$curl_error" | head -c 150)"
        fi
        if [ -n "$response" ]; then
            echo -e "      Response Preview: $(echo "$response" | head -c 200)"
        fi
        echo -e "${YELLOW}   💡 Troubleshooting:${NC}"
        echo -e "      1. Test API health: curl ${API_BASE_URL}/health"
        echo -e "      2. Verify network connectivity"
        echo -e "      3. Check API logs in Cloud Run console"
        echo -e "      4. API might be processing (120s timeout may be too short)"
        FAILED=$((FAILED + 1))
        echo ""
        return 1
    fi
    
    echo ""
    
    # Check success
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}   ✅ Itinerary Generated Successfully (${elapsed}s)${NC}"
        
        # Try to extract trip info
        if echo "$response_body" | grep -q "tripTitle\|itinerary\|dailyPlans"; then
            local trip_title=$(echo "$response_body" | grep -o '"tripTitle":"[^"]*"' | head -n 1 | sed 's/"tripTitle":"//;s/"$//')
            local total_cost=$(echo "$response_body" | grep -o '"totalEstimatedCost":[0-9]*' | head -n 1 | sed 's/"totalEstimatedCost"://')
            
            if [ -n "$trip_title" ]; then
                echo -e "${GREEN}   📋 Trip:${NC} $trip_title"
            fi
            if [ -n "$total_cost" ]; then
                echo -e "${GREEN}   💵 Cost:${NC} ₹$total_cost"
            fi
        else
            echo -e "${YELLOW}   📄 Response received (${#response_body} chars)${NC}"
            echo -e "${YELLOW}   First 100 chars:${NC} ${response_body:0:100}..."
        fi
        
        SUCCESSFUL=$((SUCCESSFUL + 1))
    else
        echo -e "${RED}   ❌ Itinerary Generation Failed (${elapsed}s)${NC}"
        echo -e "${RED}   📛 HTTP Code:${NC} $http_code"
        
        if [ -n "$response_body" ]; then
            echo -e "${RED}   📄 Error:${NC}"
            echo "$response_body" | head -n 3 | sed 's/^/       /'
        fi
        
        FAILED=$((FAILED + 1))
    fi
    
    echo ""
    
    # Small delay between requests
    if [ $request_num -lt $TOTAL_REQUESTS ]; then
        echo -e "${YELLOW}⏸️  Waiting 2 seconds before next request...${NC}"
        echo ""
        sleep 2
    fi
}

# ==============================================================================
# TEST CASES - Diverse scenarios for observability
# ==============================================================================

# Test 1: Normal Adventure Request
generate_itinerary 1 \
    "Tokyo, Japan" \
    1 \
    "90000" \
    2 \
    "adventure" \
    "temples, street food, nightlife, photography spots"

# Test 2: Luxury Request (high budget)
generate_itinerary 2 \
    "Dubai, UAE" \
    2 \
    "150000" \
    2 \
    "luxury" \
    "five-star hotels, fine dining, private tours, spa"

# Test 3: Cultural Request (extended stay)
generate_itinerary 3 \
    "Kyoto, Japan" \
    3 \
    "80000" \
    2 \
    "cultural" \
    "temples, tea ceremonies, traditional gardens, local crafts"

# Test 4: Budget/Party Request
generate_itinerary 4 \
    "Bangkok, Thailand" \
    2 \
    "60000" \
    4 \
    "party" \
    "nightlife, street markets, affordable hostels, rooftop bars"

# ==============================================================================
# FINAL STATISTICS
# ==============================================================================

echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                    📊 Traffic Generation Results              ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Total Requests Attempted:${NC}  $TOTAL_REQUESTS"
echo -e "${GREEN}✅ Fully Successful:${NC}       $SUCCESSFUL ($(awk "BEGIN {printf \"%.1f\", ($SUCCESSFUL/$TOTAL_REQUESTS)*100}")%)"
echo -e "${RED}❌ Failed:${NC}               $FAILED ($(awk "BEGIN {printf \"%.1f\", ($FAILED/$TOTAL_REQUESTS)*100}")%)"
echo -e "${YELLOW}⏱️  Total Time Elapsed:${NC}    ${TOTAL_TIME}s"
echo -e "${YELLOW}⏱️  Average Request Time:${NC}  $(awk "BEGIN {printf \"%.1f\", $TOTAL_TIME/$TOTAL_REQUESTS}")s"
echo ""

# Final assessment
if [ $SUCCESSFUL -eq $TOTAL_REQUESTS ]; then
    echo -e "${GREEN}🎉 Perfect! All requests completed successfully!${NC}"
    echo -e "${GREEN}📊 Your Datadog dashboard should show fresh traffic from ${TOTAL_REQUESTS} unique sessions.${NC}"
elif [ $SUCCESSFUL -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Partial success. ${SUCCESSFUL}/${TOTAL_REQUESTS} requests succeeded.${NC}"
    echo -e "${YELLOW}📊 You have some observability data for testing.${NC}"
else
    echo -e "${RED}🚨 All requests failed. Please check:${NC}"
    echo -e "   1. API endpoint availability"
    echo -e "   2. Network connectivity"
    echo -e "   3. API rate limits"
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}📈 View Generated Traffic in Datadog${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}💡 Pro Tips:${NC}"
echo -e "   • Run this script multiple times to generate more test data"
echo -e "   • Each run creates ${TOTAL_REQUESTS} unique user sessions"
echo -e "   • Check Datadog's 'Trace Success Rate' widget after running"
echo -e "   • Look for your new sessions in the 'Traces' explorer"
echo ""