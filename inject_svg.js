const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const svg = fs.readFileSync('exact_sol_vector_opt.svg', 'utf8');

const startMarker = '<div class="sol-eye-icon-wrapper" id="sol-eye-icon" title="SOL - Globally Known">';
const endMarker = '<!-- Centered Greeting -->';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newMarkup = startMarker + '\n' + svg + '\n            </div>\n\n            ';
  html = html.substring(0, startIndex) + newMarkup + html.substring(endIndex);
  fs.writeFileSync('index.html', html);
  console.log('Successfully injected exact SVG into index.html!');
} else {
  console.error('Markers not found in index.html');
}
