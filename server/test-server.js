const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 Testing server startup...');

// Start the server
const serverProcess = spawn('npx', ['ts-node', 'server.ts'], {
  cwd: __dirname,
  stdio: 'pipe'
});

let serverStarted = false;

// Listen for server output
serverProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('Server output:', output);
  
  if (output.includes('Server is running on port')) {
    serverStarted = true;
    console.log('✅ Server started successfully!');
    
    // Test the health endpoint
    testHealthEndpoint();
  }
});

serverProcess.stderr.on('data', (data) => {
  console.log('Server error:', data.toString());
});

function testHealthEndpoint() {
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('✅ Health check response:', JSON.parse(data));
      console.log('🎉 Server is working!');
      
      // Clean up
      serverProcess.kill();
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.error('❌ Health check failed:', err.message);
    serverProcess.kill();
    process.exit(1);
  });

  req.end();
}

// Timeout after 10 seconds
setTimeout(() => {
  if (!serverStarted) {
    console.log('❌ Server failed to start within 10 seconds');
    serverProcess.kill();
    process.exit(1);
  }
}, 10000); 