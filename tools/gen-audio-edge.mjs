// gen-audio-edge.mjs — generate course narration with Microsoft Edge neural voices.
// Usage: node tools/gen-audio-edge.mjs lessons/lesson-N.md audio/lesson-N.mp3
// Requires: Node 22+ (built-in WebSocket) and internet access. No npm packages.
import { readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const VOICE = 'en-US-GuyNeural'; // clear, professional male neural voice
const RATE = '+5%';
const TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const URL = `wss://speech.platform.bing.com/consumer/speech/synthesize/edge/v1?TrustedClientToken=${TOKEN}`;

function extractNarration(md) {
  const start = md.indexOf('## Audio narration script');
  const end = md.indexOf('## Video script');
  if (start < 0 || end < 0) throw new Error('narration section not found');
  return md.slice(start, end)
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('[') && !l.startsWith('---'))
    .join(' ')
    .replace(/\*\*/g, '')
    .replace(/₦/g, 'Naira ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitChunks(text, max = 900) {
  const sentences = text.match(/[^.!?]+[.!?]+["”’]?\s*/g) || [text];
  const chunks = [];
  let cur = '';
  for (const s of sentences) {
    if (cur && (cur + s).length > max) { chunks.push(cur); cur = s; }
    else cur += s;
  }
  if (cur) chunks.push(cur);
  return chunks;
}

const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function ttsChunk(text) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(URL, {
      headers: {
        Origin: 'https://www.bing.com',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      },
    });
    const chunks = [];
    let done = false;
    const timer = setTimeout(() => {
      if (!done) { done = true; try { ws.close(); } catch {} reject(new Error('timeout')); }
    }, 90000);

    ws.addEventListener('open', () => {
      ws.send(
        'Path: speech.config\r\nContent-Type: application/json\r\n\r\n' +
          '{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"true"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}'
      );
      const ssml =
        `<speak version='1.0' xml:lang='en-US'><voice name='${VOICE}'><prosody rate='${RATE}' pitch='0%'>` +
        `${escapeXml(text)}</prosody></voice></speak>`;
      ws.send(`Path: ssml\r\nContent-Type: application/ssml+xml\r\n\r\n${ssml}`);
    });
    ws.addEventListener('message', (event) => {
      const data = event.data;
      const isBinary = data instanceof ArrayBuffer || Buffer.isBuffer(data);
      if (isBinary) {
        const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
        const headerEnd = buf.indexOf('\r\n\r\n');
        if (headerEnd < 0) return;
        const header = buf.slice(0, headerEnd).toString();
        if (header.includes('Path: audio')) {
          chunks.push(Buffer.from(buf.slice(headerEnd + 4).toString(), 'base64'));
        }
      } else {
        try {
          const msg = JSON.parse(String(data));
          if (msg.header && msg.header.Path === 'turn.end') {
            done = true; clearTimeout(timer); ws.close();
            resolve(Buffer.concat(chunks));
          }
        } catch {}
      }
    });
    ws.addEventListener('error', (e) => {
      const detail = e.message || (e.error && e.error.message) || JSON.stringify(e.error || e);
      console.error('WS ERROR:', detail, '| readyState:', ws.readyState);
      if (!done) { done = true; clearTimeout(timer); reject(new Error(detail)); }
    });
    ws.addEventListener('close', (e) => {
      if (!done) { done = true; clearTimeout(timer); reject(new Error(`closed before turn.end (code ${e.code})`)); }
    });
  });
}

const [, , lessonFile, outFile] = process.argv;
if (!lessonFile || !outFile) {
  console.error('Usage: node tools/gen-audio-edge.mjs <lesson.md> <out.mp3>');
  process.exit(1);
}

const text = extractNarration(readFileSync(lessonFile, 'utf8'));
const chunks = splitChunks(text);
console.log(`${lessonFile}: ${text.length} chars -> ${chunks.length} chunk(s), voice ${VOICE}`);

const parts = [];
for (let i = 0; i < chunks.length; i++) {
  const buf = await ttsChunk(chunks[i]);
  parts.push(buf);
  console.log(`  chunk ${i + 1}/${chunks.length} done (${(buf.length / 1024).toFixed(0)} KB)`);
}
const out = Buffer.concat(parts);
writeFileSync(outFile, out);
console.log(`WROTE ${outFile} (${(out.length / 1024 / 1024).toFixed(1)} MB)`);
