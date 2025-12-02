const fs = require('fs');
const path = require('path');
const { rgbToHex, hexToRgb, hsvToRgb, rgbToHsv } = require(path.join(__dirname, 'utils', 'color.js'));

function assert(x, msg){ if(!x) throw new Error(msg || 'assertion failed'); }

// tests
assert(rgbToHex(255,0,0) === '#FF0000', 'rgbToHex red');
assert(rgbToHex(0,255,0) === '#00FF00', 'rgbToHex green');
assert(rgbToHex(0,0,255) === '#0000FF', 'rgbToHex blue');

const rgb = hexToRgb('#336699'); assert(rgb.r===51 && rgb.g === 102 && rgb.b===153, 'hexToRgb #336699');

const r1 = hsvToRgb(0,1,1); assert(r1.r === 255 && r1.g === 0 && r1.b === 0, 'hsvToRgb red');
const h1 = rgbToHsv(255,0,0); assert(h1.h === 0, 'rgbToHsv red');

console.log('All simple color util tests passed');
