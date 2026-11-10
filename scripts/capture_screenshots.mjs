import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('fastlane/metadata/android/en-US/images/phoneScreenshots');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Start HTTP server for dist/
const server = spawn('python3', ['-m', 'http.server', '4173', '-d', 'dist/'], { stdio: 'ignore' });

// Start Chrome headless with remote debugging
const chrome = spawn('google-chrome', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--no-sandbox',
  '--disable-gpu',
  '--hide-scrollbars',
  'about:blank'
], { stdio: 'ignore' });

// Helper to wait
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  await wait(1500);

  // Get WebSocket URL from Chrome
  const res = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await res.json();
  const wsUrl = tabs[0]?.webSocketDebuggerUrl;
  if (!wsUrl) throw new Error('No WebSocket URL from Chrome');

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve) => ws.onopen = resolve);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');

  // Emulate modern Android device: 1080 x 2400 (scale: 2.625)
  // CSS viewport: 412 x 915
  await send('Emulation.setDeviceMetricsOverride', {
    width: 412,
    height: 915,
    deviceScaleFactor: 2.625,
    mobile: true,
    fitWindow: false
  });

  console.log('Navigating to http://localhost:4173 ...');
  await send('Page.navigate', { url: 'http://localhost:4173' });

  // Wait for React & DuckDB initialization
  await wait(3500);

  // Screenshot 1: Exercise Studio
  console.log('Capturing 1_exercise_studio.png ...');
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT_DIR, '1_exercise_studio.png'), Buffer.from(shot1.data, 'base64'));

  // Screenshot 2: Click the "Syllabus" button to open Curriculum drawer
  console.log('Opening Curriculum Syllabus drawer ...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        // Find and click the Syllabus button in header
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Syllabus') || b.title?.includes('Syllabus') || b.querySelector('svg'));
        const allButtons = Array.from(document.querySelectorAll('button'));
        const syllabusBtn = allButtons.find(b => b.textContent.includes('Syllabus')) || allButtons[1];
        if (syllabusBtn) syllabusBtn.click();
      })()
    `
  });
  await wait(800);

  console.log('Capturing 2_curriculum_syllabus.png ...');
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT_DIR, '2_curriculum_syllabus.png'), Buffer.from(shot2.data, 'base64'));

  // Close drawer by clicking backdrop or close button, or refresh
  await send('Page.navigate', { url: 'http://localhost:4173' });
  await wait(2000);

  // Switch to Playground (Sandbox) tab
  console.log('Switching to Playground / Sandbox tab ...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const playgroundBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Playground') || b.textContent.includes('Sandbox'));
        if (playgroundBtn) playgroundBtn.click();
      })()
    `
  });
  await wait(1000);

  // Run the playground query by clicking "Run Query"
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const runBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Run') || b.title?.includes('Run'));
        if (runBtn) runBtn.click();
      })()
    `
  });
  await wait(1500);

  console.log('Capturing 3_sql_sandbox.png ...');
  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT_DIR, '3_sql_sandbox.png'), Buffer.from(shot3.data, 'base64'));

  ws.close();
  console.log('Screenshots captured successfully!');
}

run().finally(() => {
  server.kill();
  chrome.kill();
});

