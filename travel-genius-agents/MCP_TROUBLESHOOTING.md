# MCP Toolbox Troubleshooting Guide

## 🔍 What is the MCP Issue?

The MCP (Model Context Protocol) Toolbox is an **optional** external service that provides additional travel tools. The application is designed to work **with or without** it.

**Error you might see:**
```
RuntimeError: Fail to load 'agent' module. API request failed with status 503 (Service Unavailable)
```

## ✅ Current Status: FIXED

The application now handles MCP unavailability gracefully. It will:
- ✅ Start successfully even if MCP is down
- ✅ Use local tools (weather, destination, itinerary) 
- ✅ Continue functioning normally
- ⚠️ Show a warning message if MCP is unavailable

## 🔧 How to Fix/Check MCP Connection

### Step 1: Check if MCP Server is Running

**Check the default URL:**
```bash
# Test if MCP server is accessible
curl http://127.0.0.1:5000/health
# or
curl http://localhost:5000/health
```

**Expected responses:**
- ✅ `200 OK` or JSON response = Server is running
- ❌ `Connection refused` or `503` = Server is NOT running

### Step 2: Check MCP Configuration

**Location:** `travel-genius-agents/agent/agent.py` (line 28)

```python
toolbox_url = os.getenv("MCP_TOOLBOX_URL", "http://127.0.0.1:5000")
```

**To change the URL:**
1. Create a `.env` file in `travel-genius-agents/` directory
2. Add:
   ```
   MCP_TOOLBOX_URL=http://your-mcp-server:port
   ```

### Step 3: Verify Application Startup

**Start your application:**
```bash
cd travel-genius-agents
python app.py
# or
uvicorn app:app --reload
```

**Look for these messages:**

✅ **MCP Available:**
```
Connection successful!
Loaded X travel tools from toolbox
✅ MCP Toolbox connected - X additional tools available
```

⚠️ **MCP Unavailable (Still Works!):**
```
Warning: Failed to load travel tools from toolbox (RuntimeError): ...
Continuing without toolbox tools. Agents will use local tools only.
⚠️  MCP Toolbox unavailable - agents will use local tools only (weather, destination, itinerary)
   Application will function normally but some advanced features may be limited.
```

### Step 4: Test Application Functionality

**Test itinerary generation:**
1. Start the backend: `python app.py`
2. Start the frontend: `npm run dev` (in ai-travel-genius/)
3. Try generating an itinerary
4. ✅ Should work even without MCP!

## 🚀 How to Start MCP Server (If You Have It)

If you have an MCP Toolbox server setup:

### Option 1: Check if MCP Server Exists
```bash
# Look for MCP server files
find . -name "*mcp*" -o -name "*toolbox*"
ls -la | grep -i mcp
```

### Option 2: Start MCP Server (if you have the code)
```bash
# Navigate to MCP server directory
cd /path/to/mcp-toolbox-server

# Install dependencies
npm install  # or pip install -r requirements.txt

# Start server
npm start    # or python server.py
# Server should run on port 5000 (or check your config)
```

### Option 3: Use Docker (if available)
```bash
docker run -p 5000:5000 your-mcp-toolbox-image
```

## 📋 Checklist: Where to Check

### ✅ Backend Checks (`travel-genius-agents/`)

1. **Check agent.py (line 28-45):**
   - ✅ Try-catch block is present
   - ✅ `travel_tools = []` fallback is set
   - ✅ Warning messages are printed

2. **Check environment variables:**
   ```bash
   # In travel-genius-agents/ directory
   cat .env | grep MCP_TOOLBOX_URL
   # or check if it's set
   echo $MCP_TOOLBOX_URL
   ```

3. **Check application logs:**
   - Look for "Connection successful!" or "Warning: Failed to load"
   - Check for any error messages

### ✅ Frontend Checks (`ai-travel-genius/`)

1. **Check adk-service.ts:**
   - ✅ No MCP dependencies (already verified)
   - ✅ Only calls ADK API endpoint
   - ✅ No changes needed

2. **Test frontend:**
   ```bash
   cd ai-travel-genius
   npm run dev
   # Try generating an itinerary
   ```

## 🎯 Quick Fix Options

### Option 1: Disable MCP (Recommended if you don't need it)
**No action needed!** The application already handles this gracefully.

### Option 2: Fix MCP Connection
1. Ensure MCP server is running on port 5000
2. Check firewall/network settings
3. Verify MCP_TOOLBOX_URL in .env file

### Option 3: Change MCP URL
Create/update `.env` file:
```bash
# In travel-genius-agents/ directory
echo "MCP_TOOLBOX_URL=http://your-server:port" > .env
```

## 🧪 Testing the Fix

### Test 1: Application Starts Without MCP
```bash
cd travel-genius-agents
python app.py
# Should see warning but still start successfully
```

### Test 2: Generate Itinerary
1. Start backend
2. Start frontend
3. Generate an itinerary
4. ✅ Should work with local tools

### Test 3: Check Logs
```bash
# Look for these in console output:
✅ "Connection successful!" = MCP working
⚠️ "Warning: Failed to load" = MCP unavailable but app works
```

## 📊 What Tools Are Available

### ✅ Always Available (Local Tools)
- `weather_function_tools` - Weather analysis
- `destination_function_tools` - Destination discovery
- `itinerary_function_tools` - Itinerary parsing
- `common_function_tools` - Common utilities

### ⚠️ Optional (MCP Tools - only if server running)
- `search-transport-options` - Transport search
- `search-hotels-enhanced` - Hotel search
- `search-activities-by-interest` - Activity search
- `get-hidden-gems` - Hidden gems discovery
- `calculate-trip-budget` - Budget calculation

## 🎉 Summary

**The fix is already in place!** Your application:
- ✅ Handles MCP unavailability gracefully
- ✅ Works with local tools only
- ✅ Doesn't crash on startup
- ✅ Frontend is unaffected

**You only need to:**
1. Verify the application starts (check logs)
2. Test itinerary generation (should work)
3. Optionally: Start MCP server if you want additional features

## 🆘 Still Having Issues?

1. **Check application logs** for specific error messages
2. **Verify .env file** exists and has correct MCP_TOOLBOX_URL
3. **Test MCP server** directly: `curl http://127.0.0.1:5000/health`
4. **Check network/firewall** if MCP server is on different machine
5. **Review agent.py** lines 28-45 to ensure try-catch is present

