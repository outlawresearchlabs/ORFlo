#!/bin/bash
# Test script for outlaw-flow MCP wrapper integration

echo "🧪 Testing Outlaw-Flow MCP Wrapper Integration"
echo "=============================================="
echo ""

# Test 1: Check if wrapper starts correctly
echo "📍 Test 1: Starting MCP server with wrapper..."
echo "Running: npm run mcp"
echo ""

# Create a test client script
cat > test-mcp-client.js << 'EOF'
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testMCP() {
  console.log('🔌 Connecting to MCP server...');
  
  const transport = new StdioClientTransport({
    command: 'npm',
    args: ['run', 'mcp'],
  });

  const client = new Client({
    name: 'test-client',
    version: '1.0.0',
  }, {
    capabilities: {},
  });

  try {
    await client.connect(transport);
    console.log('✅ Connected successfully!');
    
    // List tools
    console.log('\n📋 Listing tools...');
    const tools = await client.listTools();
    console.log(`Found ${tools.tools.length} tools`);
    
    // Test sparc_list
    console.log('\n🧪 Testing sparc_list...');
    const listResult = await client.callTool('sparc_list', { verbose: false });
    console.log('Result:', listResult.content[0].text.substring(0, 200) + '...');
    
    // Test sparc_coder
    console.log('\n🧪 Testing sparc_coder (would forward to Claude Code)...');
    const coderResult = await client.callTool('sparc_coder', {
      task: 'Create a simple greeting function',
      context: { memoryKey: 'test_greeting' }
    });
    console.log('Result preview:', coderResult.content[0].text.substring(0, 200) + '...');
    
    await client.close();
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testMCP().catch(console.error);
EOF

echo "📝 Running MCP client test..."
node test-mcp-client.js

# Clean up
rm -f test-mcp-client.js

echo ""
echo "✅ Integration test complete!"
echo ""
echo "📌 Next steps:"
echo "1. The MCP server now uses the wrapper by default"
echo "2. All SPARC tools forward to Claude Code with prompt injection"
echo "3. To use legacy mode: OUTLAW_FLOW_LEGACY_MCP=true npm run mcp"
echo "4. Configure in Claude Desktop with: outlaw-flow.mcp.json"