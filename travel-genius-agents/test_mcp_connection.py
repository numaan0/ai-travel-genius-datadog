#!/usr/bin/env python3
"""
Quick test script to check MCP Toolbox connection status
Run this to verify if MCP server is accessible
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_mcp_connection():
    """Test MCP Toolbox server connection"""
    
    toolbox_url = os.getenv("MCP_TOOLBOX_URL", "http://127.0.0.1:5000")
    
    print("=" * 60)
    print("MCP Toolbox Connection Test")
    print("=" * 60)
    print(f"Testing URL: {toolbox_url}")
    print()
    
    try:
        from toolbox_core import ToolboxSyncClient
        
        print("1. Creating ToolboxSyncClient...")
        toolbox = ToolboxSyncClient(toolbox_url)
        print("   [OK] Client created successfully")
        
        print("\n2. Loading travel_genius_toolset...")
        travel_tools = toolbox.load_toolset('travel_genius_toolset')
        print(f"   [OK] Loaded {len(travel_tools)} travel tools")
        
        if len(travel_tools) > 0:
            print("\n3. Available tools:")
            for i, tool in enumerate(travel_tools, 1):
                tool_name = getattr(tool, 'name', str(tool))
                print(f"   {i}. {tool_name}")
        
        print("\n" + "=" * 60)
        print("[SUCCESS] MCP Toolbox is connected and working!")
        print("=" * 60)
        return True
        
    except RuntimeError as e:
        print(f"\n   [ERROR] RuntimeError: {e}")
        print("\n" + "=" * 60)
        print("[WARNING] MCP Toolbox server is NOT available")
        print("=" * 60)
        print("\nPossible reasons:")
        print("  - MCP server is not running")
        print("  - Wrong URL (check MCP_TOOLBOX_URL in .env)")
        print("  - Network/firewall issue")
        print("\n[OK] Application will still work with local tools only")
        return False
        
    except ImportError as e:
        print(f"\n   [ERROR] ImportError: {e}")
        print("\n" + "=" * 60)
        print("[WARNING] toolbox_core module not found")
        print("=" * 60)
        print("\nInstall it with:")
        print("  pip install toolbox-core")
        print("\n[OK] Application will still work without MCP tools")
        return False
        
    except Exception as e:
        print(f"\n   [ERROR] {type(e).__name__}: {e}")
        print("\n" + "=" * 60)
        print("[WARNING] MCP Toolbox connection failed")
        print("=" * 60)
        print("\n[OK] Application will still work with local tools only")
        return False

if __name__ == "__main__":
    success = test_mcp_connection()
    sys.exit(0 if success else 1)

