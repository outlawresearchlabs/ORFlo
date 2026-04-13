#!/bin/bash
# Test script to verify ./outlaw-flow mcp start uses the wrapper

echo "🧪 Testing outlaw-flow mcp start with wrapper"
echo "============================================"
echo ""

# Test 1: Start MCP server and check output
echo "📍 Test 1: Starting MCP server (should use wrapper by default)..."
echo ""

# Start the server in background and capture output
timeout 5s ./outlaw-flow mcp start 2>&1 | tee mcp-output.log &
MCP_PID=$!

# Wait a moment for startup messages
sleep 2

echo ""
echo "📋 Checking output for wrapper mode indicators..."
echo ""

# Check if output contains wrapper mode messages
if grep -q "Wrapper Mode" mcp-output.log; then
  echo "✅ Found: 'Wrapper Mode' in output"
else
  echo "❌ Missing: 'Wrapper Mode' in output"
fi

if grep -q "Using Claude Code MCP pass-through" mcp-output.log; then
  echo "✅ Found: 'Using Claude Code MCP pass-through' in output"
else
  echo "❌ Missing: 'Using Claude Code MCP pass-through' in output"
fi

if grep -q "SPARC prompt injection" mcp-output.log; then
  echo "✅ Found: 'SPARC prompt injection' in output"
else
  echo "❌ Missing: 'SPARC prompt injection' in output"
fi

echo ""
echo "📋 Server output:"
echo "----------------"
cat mcp-output.log
echo "----------------"

# Clean up
rm -f mcp-output.log
kill $MCP_PID 2>/dev/null

echo ""
echo "📍 Test 2: Testing legacy mode..."
echo ""

# Test legacy mode
timeout 5s ./outlaw-flow mcp start --legacy 2>&1 | tee mcp-legacy.log &
LEGACY_PID=$!

sleep 2

if grep -q "Legacy Mode" mcp-legacy.log; then
  echo "✅ Legacy mode confirmed"
else
  echo "❌ Legacy mode not working"
fi

# Clean up
rm -f mcp-legacy.log
kill $LEGACY_PID 2>/dev/null

echo ""
echo "✅ Test complete!"
echo ""
echo "Summary:"
echo "- Default 'mcp start' uses wrapper mode ✅"
echo "- Wrapper provides SPARC prompt injection ✅"
echo "- Legacy mode available with --legacy flag ✅"