function bezier(t) {
  const mt = 1 - t;
  const x = mt*mt*mt*12 + 3*mt*mt*t*26 + 3*mt*t*t*74 + t*t*t*88;
  const y = mt*mt*mt*120 + 3*mt*mt*t*100 + 3*mt*t*t*100 + t*t*t*120;
  
  // Derivative dx/dt, dy/dt
  const dx = 3*mt*mt*(26-12) + 6*mt*t*(74-26) + 3*t*t*(88-74);
  const dy = 3*mt*mt*(100-120) + 6*mt*t*(100-100) + 3*t*t*(120-100);
  
  // Normal vector pointing UPWARDS/OUTWARDS
  const len = Math.hypot(dx, dy);
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0) { nx = -nx; ny = -ny; }
  
  return { x, y, nx, ny };
}

const tValues = [0.21, 0.355, 0.50, 0.645, 0.79]; // Slightly wider fan spread
const gap = 9.0; // Uniform space between eyelashes and the eye outline
const lashLen = 11.0; // Eyelash stroke length

tValues.forEach((t, idx) => {
  const p = bezier(t);
  const startX = (p.x + gap * p.nx).toFixed(1);
  const startY = (p.y + gap * p.ny).toFixed(1);
  const endX = (p.x + (gap + lashLen) * p.nx).toFixed(1);
  const endY = (p.y + (gap + lashLen) * p.ny).toFixed(1);
  
  console.log(`<!-- Eyelash ${idx+1} -->`);
  console.log(`<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke-width="4.5" stroke-linecap="round" />`);
});
