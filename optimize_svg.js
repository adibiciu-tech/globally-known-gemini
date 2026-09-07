const fs = require('fs');
const zlib = require('zlib');

// Create lightweight path-optimized vector SVG from sol_mask.png
const buffer = fs.readFileSync('sol_mask.png');
let offset = 8;
let width, height;
let idatBuffers = [];

while (offset < buffer.length) {
  const length = buffer.readUInt32BE(offset);
  const type = buffer.toString('ascii', offset + 4, offset + 8);
  if (type === 'IHDR') {
    width = buffer.readUInt32BE(offset + 8);
    height = buffer.readUInt32BE(offset + 12);
  } else if (type === 'IDAT') {
    idatBuffers.push(buffer.slice(offset + 8, offset + 8 + length));
  }
  offset += 12 + length;
}

const compressed = Buffer.concat(idatBuffers);
const decompressed = zlib.inflateSync(compressed);
const scanlineLength = width * 4 + 1;

// RLE horizontal span merging
const stemSpans = [];
const pupilSpans = [];

const centerX = 418, centerY = 852, radius = 72;

for (let y = 0; y < height; y++) {
  let stemStart = -1, pupilStart = -1;

  for (let x = 0; x < width; x++) {
    const a = decompressed[y * scanlineLength + 1 + x * 4 + 3];
    const isSolid = a > 100;
    const dist = Math.hypot(x - centerX, y - centerY);
    const isPupil = (dist <= radius && y >= 770);

    // Stem span
    if (isSolid && !isPupil) {
      if (stemStart === -1) stemStart = x;
    } else {
      if (stemStart !== -1) {
        stemSpans.push(`M${stemStart},${y}h${x - stemStart}v1h-${x - stemStart}z`);
        stemStart = -1;
      }
    }

    // Pupil span
    if (isSolid && isPupil) {
      if (pupilStart === -1) pupilStart = x;
    } else {
      if (pupilStart !== -1) {
        pupilSpans.push(`M${pupilStart},${y}h${x - pupilStart}v1h-${x - pupilStart}z`);
        pupilStart = -1;
      }
    }
  }

  if (stemStart !== -1) stemSpans.push(`M${stemStart},${y}h${width - stemStart}v1h-${width - stemStart}z`);
  if (pupilStart !== -1) pupilSpans.push(`M${pupilStart},${y}h${width - pupilStart}v1h-${width - pupilStart}z`);
}

const svgContent = `<svg class="sol-eye-icon-svg" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <g class="sol-stem-group">
    <path class="sol-exact-stem" d="${stemSpans.join('')}" />
  </g>
  <g class="sol-eyelid-group">
    <g class="sol-pupil-group">
      <path class="sol-exact-pupil" d="${pupilSpans.join('')}" />
    </g>
  </g>
</svg>`;

fs.writeFileSync('exact_sol_vector_opt.svg', svgContent);
console.log('Optimized vector SVG! Spans count - stem:', stemSpans.length, 'pupil:', pupilSpans.length);
