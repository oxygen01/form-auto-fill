import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background gradient (blue)
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#2563eb');
  gradient.addColorStop(1, '#1d4ed8');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Wand icon
  ctx.strokeStyle = 'white';
  ctx.lineWidth = Math.max(2, size / 16);
  ctx.lineCap = 'round';
  
  const padding = size * 0.2;
  ctx.beginPath();
  ctx.moveTo(padding, size - padding);
  ctx.lineTo(size - padding, padding);
  ctx.stroke();
  
  // Stars
  ctx.fillStyle = 'white';
  const starSize = size * 0.08;
  ctx.fillRect(size - padding - starSize, padding - starSize, starSize, starSize);
  ctx.fillRect(padding - starSize/2, size - padding + starSize/2, starSize, starSize);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  const dir = path.join(process.cwd(), 'public', 'icons');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, `icon${size}.png`), buffer);
  console.log(`Generated icon${size}.png`);
}

[16, 48, 128].forEach(generateIcon);
