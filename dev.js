const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

console.log('=====================================================================');
console.log('          AGRIDRONE HUB — DEVELOPMENT LAUNCHER');
console.log('   "More Flights. Less Idle Time. Higher Farm Profitability."');
console.log('=====================================================================\n');

function checkServerOnline(callback) {
  let finished = false;

  const req = http.get('http://localhost:5000/api/health', (res) => {
    if (!finished) {
      finished = true;
      callback(res.statusCode === 200);
    }
  });

  req.on('error', () => {
    if (!finished) {
      finished = true;
      callback(false);
    }
  });

  req.setTimeout(800, () => {
    req.destroy();
    if (!finished) {
      finished = true;
      callback(false);
    }
  });
}

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const nodeCmd = isWindows ? 'node.exe' : 'node';

checkServerOnline((isOnline) => {
  let serverProcess = null;

  if (isOnline) {
    console.log('📡 [1/2] Backend API is ALREADY running and active at http://localhost:5000');
  } else {
    console.log('🚀 [1/2] Starting Backend API Server (Node + Express on port 5000)...');
    serverProcess = spawn(nodeCmd, ['index.js'], {
      cwd: path.join(__dirname, 'server'),
      stdio: 'inherit',
      shell: false
    });
  }

  console.log('⚡ [2/2] Starting Frontend Vite Dev Server (React + Tailwind on port 5173)...');
  const viteBin = path.join(__dirname, 'client', 'node_modules', 'vite', 'bin', 'vite.js');
  const clientProcess = spawn(nodeCmd, [viteBin], {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit',
    shell: false
  });

  function cleanExit() {
    if (serverProcess) {
      try { serverProcess.kill(); } catch (e) {}
    }
    if (clientProcess) {
      try { clientProcess.kill(); } catch (e) {}
    }
    process.exit();
  }

  process.on('SIGINT', cleanExit);
  process.on('SIGTERM', cleanExit);
});
