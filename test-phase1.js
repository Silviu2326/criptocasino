const CompleteCasinoServer = require('./complete-casino-server');

console.log('🚀 Starting Crypto Casino v3.0 - Phase 1 Complete');

const server = new CompleteCasinoServer(3003);
server.start();

// Test endpoints
setTimeout(async () => {
  console.log('\n🔍 Testing endpoints...');
  
  try {
    // Test basic API
    const response = await fetch('http://localhost:3003/health');
    const data = await response.json();
    console.log('✅ Health check:', data.status);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
}, 2000);