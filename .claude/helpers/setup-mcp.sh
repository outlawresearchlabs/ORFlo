#!/bin/bash
# Setup MCP server for Outlaw Flow

echo "🚀 Setting up Outlaw Flow MCP server..."

# Check if claude command exists
if ! command -v claude &> /dev/null; then
    echo "❌ Error: Claude Code CLI not found"
    echo "Please install Claude Code first"
    exit 1
fi

# Add MCP server
echo "📦 Adding Outlaw Flow MCP server..."
claude mcp add outlaw-flow npx outlaw-flow mcp start

echo "✅ MCP server setup complete!"
echo "🎯 You can now use mcp__outlaw-flow__ tools in Claude Code"
