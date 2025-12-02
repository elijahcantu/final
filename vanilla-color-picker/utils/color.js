function componentToHex(c) { return c.toString(16).padStart(2, '0').toUpperCase(); }
function rgbToHex(r,g,b){ return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`; }
function hexToRgb(hex){ const h = hex.replace('#',''); if(h.length !== 6) return null; return { r: parseInt(h.substr(0,2),16), g: parseInt(h.substr(2,2),16), b: parseInt(h.substr(4,2),16) }; }

function hsvToRgb(h, s, v){ s=Math.max(0,Math.min(1,s)); v=Math.max(0,Math.min(1,v)); const c = v * s; const hh = (h % 360) / 60; const x = c * (1 - Math.abs(hh % 2 - 1)); let r1=0,g1=0,b1=0; if(hh>=0 && hh<1){ r1=c; g1=x; b1=0; } else if(hh<2){ r1=x; g1=c; b1=0; } else if(hh<3){ r1=0; g1=c; b1=x; } else if(hh<4){ r1=0; g1=x; b1=c; } else if(hh<5){ r1=x; g1=0; b1=c; } else { r1=c; g1=0; b1=x; } const m = v - c; return { r: Math.round((r1 + m) * 255), g: Math.round((g1 + m) * 255), b: Math.round((b1 + m) * 255) } }

function rgbToHsv(r,g,b){ r/=255; g/=255; b/=255; const max = Math.max(r,g,b), min = Math.min(r,g,b); const d = max - min; let h=0; if(d === 0){ h = 0; } else if(max === r){ h = (g - b)/d % 6; } else if(max === g){ h = (b - r)/d + 2; } else { h = (r - g)/d + 4; } h = Math.round(h * 60); if(h < 0) h += 360; const v = max; const s = max === 0 ? 0 : d / max; return { h, s: Number(s.toFixed(3)), v: Number(v.toFixed(3)) } }

module.exports = { componentToHex, rgbToHex, hexToRgb, hsvToRgb, rgbToHsv };
