/* Vanilla Color Picker — Basic, feature-complete implementation
 * - Canvas-based SV (Saturation / Value) picker
 * - Hue slider
 * - HEX / RGB / HSL display + editable
 * - Palette generation (complementary, triadic, analogous)
 * - Contrast check
 * - History storing in localStorage
 */

// We'll reuse a separate module for color conversions (utils/color.js), but keep wrappers for legacy code
// For now, import via script tag or just make sure the functions are declared as global wrappers for the module's
// convenience. We will import later for Node tests.
/* global colorUtils */
// Fallback wrappers in case the utils file wasn't separately loaded
function componentToHex(c){ return c.toString(16).padStart(2, '0').toUpperCase(); }
function rgbToHex(r,g,b){ return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`; }
function hexToRgb(hex){ const h = hex.replace('#',''); if(h.length !== 6) return null; return { r: parseInt(h.substr(0,2),16), g: parseInt(h.substr(2,2),16), b: parseInt(h.substr(4,2),16) }; }
function rgbToHsl(r,g,b){ r/=255; g/=255; b/=255; const max=Math.max(r,g,b), min=Math.min(r,g,b); let h,s,l=(max+min)/2; if(max===min){ h=s=0; } else { const d = max-min; s = l > .5 ? d / (2 - max - min) : d / (max + min); switch(max){ case r: h = (g-b)/d + (g<b?6:0); break; case g: h = (b-r)/d + 2; break; case b: h = (r-g)/d + 4; break; } h *= 60; } return { h: Math.round(h), s: Math.round(s*100), l: Math.round(l*100) }; }
function hsvToRgb(h, s, v){ s=Math.max(0,Math.min(1,s)); v=Math.max(0,Math.min(1,v)); const c = v * s; const hh = (h % 360) / 60; const x = c * (1 - Math.abs(hh % 2 - 1)); let r1=0,g1=0,b1=0; if(hh>=0 && hh<1){ r1=c; g1=x; b1=0; } else if(hh<2){ r1=x; g1=c; b1=0; } else if(hh<3){ r1=0; g1=c; b1=x; } else if(hh<4){ r1=0; g1=x; b1=c; } else if(hh<5){ r1=x; g1=0; b1=c; } else { r1=c; g1=0; b1=x; } const m = v - c; return { r: Math.round((r1 + m) * 255), g: Math.round((g1 + m) * 255), b: Math.round((b1 + m) * 255) } }
function rgbToHsv(r,g,b){ r/=255; g/=255; b/=255; const max = Math.max(r,g,b), min = Math.min(r,g,b); const d = max - min; let h=0; if(d === 0){ h = 0; } else if(max === r){ h = (g - b)/d % 6; } else if(max === g){ h = (b - r)/d + 2; } else { h = (r - g)/d + 4; } h = Math.round(h * 60); if(h < 0) h += 360; const v = max; const s = max === 0 ? 0 : d / max; return { h, s: Number(s.toFixed(3)), v: Number(v.toFixed(3)) } }

function clamp(n,min,max){ return Math.min(max, Math.max(min,n)); }

// Contrast ratio per W3
function luminance(r,g,b){ const srgb = [r,g,b].map(v => v/255); const RGB = srgb.map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4)); return 0.2126*RGB[0] + 0.7152*RGB[1] + 0.0722*RGB[2]; }
function contrastRatio(rgb1, rgb2){ const L1 = luminance(rgb1.r, rgb1.g, rgb1.b); const L2 = luminance(rgb2.r, rgb2.g, rgb2.b); const [a,b] = L1 >= L2 ? [L1,L2] : [L2,L1]; return ((a+0.05)/(b+0.05)); }

// DOM + app state
const state = { h: 0, s: 1, v: 1, rgb: { r:255,g:0,b:0 } };
const canvas = document.getElementById('sv-canvas');
const ctx = canvas.getContext('2d');
const preview = document.getElementById('color-preview');
const hexInput = document.getElementById('hex-input');
const rgbInput = document.getElementById('rgb-input');
const hslInput = document.getElementById('hsl-input');
const hueRange = document.getElementById('hue-range');
const svCursor = document.getElementById('sv-cursor');
const paletteList = document.getElementById('palette-list');
const contrastInfo = document.getElementById('contrast-info');
const historyList = document.getElementById('history-list');

// High DPI scaling
function scaleCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth; const cssH = canvas.clientHeight;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
scaleCanvas();
window.addEventListener('resize', () => { scaleCanvas(); drawSV(); });

function drawSV(){ const w = canvas.clientWidth; const h = canvas.clientHeight; // base hue background
  const hueRgb = hsvToRgb(state.h, 1, 1);
  ctx.fillStyle = `rgb(${hueRgb.r},${hueRgb.g},${hueRgb.b})`;
  ctx.fillRect(0,0,w,h);
  // overlay white->transparent gradient (saturation)
  const gradS = ctx.createLinearGradient(0,0,w,0);
  gradS.addColorStop(0, 'rgba(255,255,255,1)');
  gradS.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradS; ctx.fillRect(0,0,w,h);
  // overlay transparent->black gradient (value)
  const gradV = ctx.createLinearGradient(0,0,0,h);
  gradV.addColorStop(0, 'rgba(0,0,0,0)');
  gradV.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = gradV; ctx.fillRect(0,0,w,h);
}

// update UI from state
function updateUI(){ // rgb -> other converters
  const { r,g,b } = state.rgb; preview.style.backgroundColor = `rgb(${r},${g},${b})`;
  hexInput.value = rgbToHex(r,g,b);
  rgbInput.value = `rgb(${r}, ${g}, ${b})`;
  const hsl = rgbToHsl(r,g,b); hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  // update cursor position
  const w = canvas.clientWidth, h = canvas.clientHeight;
  const x = state.s * w; const y = (1 - state.v) * h; svCursor.style.left = `${x}px`; svCursor.style.top = `${y}px`;

  // palettes & contrast
  renderPalettes(); renderContrast(); renderHistory();
}

function renderPalettes(){ paletteList.innerHTML = ''; const hs = state.h; const hues = [0, 120, 240]; // triadic (sample) + complement
  const list = [hs, (hs + 180) % 360, (hs + 120) % 360, (hs + 240) % 360, (hs + 30) % 360, (hs - 30 + 360) % 360]; const unique = Array.from(new Set(list.map(h=>Math.round(h)))); unique.slice(0,6).forEach(h => { const rgb = hsvToRgb(h, state.s, state.v); const sw = document.createElement('div'); sw.className = 'palette-swatch'; sw.style.backgroundColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`; sw.title = `h:${h}`; sw.tabIndex = 0; sw.onclick = () => { setHsv(h, state.s, state.v); }; sw.onkeydown = (e)=>{ if(e.key === 'Enter') setHsv(h, state.s, state.v); }; paletteList.appendChild(sw); }); }

function renderContrast(){ const white = {r:255,g:255,b:255}; const black = {r:0,g:0,b:0}; const cW=contrastRatio(state.rgb,white); const cB=contrastRatio(state.rgb,black); contrastInfo.innerHTML = `Against white: ${cW.toFixed(2)}; Against black: ${cB.toFixed(2)}; ` + (cW>=4.5 || cB>=4.5 ? '<span style="color:green">Pass AA</span>' : '<span style="color:orange">Fail AA</span>'); }

// History
function loadHistory(){ try { return JSON.parse(localStorage.getItem('vanilla_cp_history') || '[]'); } catch(e){ return []; } }
function saveHistory(){ const history = loadHistory(); const hex = rgbToHex(state.rgb.r,state.rgb.g,state.rgb.b); if(history[0] !== hex){ history.unshift(hex); history.splice(20); localStorage.setItem('vanilla_cp_history', JSON.stringify(history)); } }
function renderHistory(){ historyList.innerHTML = ''; const history = loadHistory(); history.forEach(hex => { const sw = document.createElement('div'); sw.className='history-swatch'; sw.style.backgroundColor = hex; sw.title = hex; sw.onclick = ()=>{ const rgb = hexToRgb(hex); const hsv = rgbToHsv(rgb.r,rgb.g,rgb.b); setHsv(hsv.h, hsv.s, hsv.v); }; historyList.appendChild(sw); }); }

function setHsv(h,s,v){ state.h = (h+360)%360; state.s = clamp(Number(s), 0, 1); state.v = clamp(Number(v), 0, 1); state.rgb = hsvToRgb(state.h, state.s, state.v); drawSV(); updateUI(); }

// pointer logic for canvas
let pointerDown = false;
function handlePointerDown(e){ pointerDown = true; canvas.setPointerCapture(e.pointerId); handlePointerMove(e); }
function handlePointerMove(e){ if(!pointerDown && e.type==='pointermove') return; const rect = canvas.getBoundingClientRect(); const x = clamp(e.clientX - rect.left, 0, rect.width); const y = clamp(e.clientY - rect.top, 0, rect.height); const s = clamp(x/rect.width, 0, 1); const v = clamp(1 - y/rect.height, 0, 1); setHsv(state.h, s, v); }
function handlePointerUp(e){ pointerDown = false; try { canvas.releasePointerCapture(e.pointerId); } catch{};
  // Only save to history when pointer is released
  saveHistory(); renderHistory();
}
canvas.addEventListener('pointerdown', handlePointerDown);
canvas.addEventListener('pointermove', handlePointerMove);
canvas.addEventListener('pointerup', handlePointerUp);
canvas.addEventListener('pointercancel', handlePointerUp);

// Add history on input changes (when user manually changes via text inputs)
hexInput.addEventListener('change', () => { saveHistory(); renderHistory(); });
rgbInput.addEventListener('change', () => { saveHistory(); renderHistory(); });
hslInput.addEventListener('change', () => { saveHistory(); renderHistory(); });

// hue slider
hueRange.addEventListener('input', e => { setHsv(Number(e.target.value), state.s, state.v); });

// Input editing handlers
hexInput.addEventListener('change', e => { const v = e.target.value.trim(); const rgb = hexToRgb(v); if(rgb){ const hsv = rgbToHsv(rgb.r,rgb.g,rgb.b); setHsv(hsv.h, hsv.s, hsv.v); } });

rgbInput.addEventListener('change', e => { const val = e.target.value.trim(); const m = val.match(/(\d{1,3})\s*,?\s*(\d{1,3})\s*,?\s*(\d{1,3})/); if(m){ const r=clamp(Number(m[1]),0,255); const g=clamp(Number(m[2]),0,255); const b=clamp(Number(m[3]),0,255); const hsv = rgbToHsv(r,g,b); setHsv(hsv.h, hsv.s, hsv.v); } });

hslInput.addEventListener('change', e => { const val = e.target.value.trim(); const m = val.match(/(\d{1,3})/g); if(m && m.length>=3){ const h=Number(m[0]), s=clamp(Number(m[1])/100,0,1), l=clamp(Number(m[2])/100,0,1); // convert HSL to RGB via algorithm
    // simple HSL->RGB (use standard conversion)
    function hslToRgb(h,s,l){ const c=(1-Math.abs(2*l-1))*s; const hh=(h%360)/60; const x=c*(1-Math.abs(hh%2-1)); let r1=0,g1=0,b1=0; if(hh>=0 && hh<1){ r1=c; g1=x; } else if(hh<2){ r1=x; g1=c; } else if(hh<3){ g1=c; b1=x; } else if(hh<4){ g1=x; b1=c; } else if(hh<5){ r1=x; b1=c; } else { r1=c; b1=x; } const m = l - c/2; const r=Math.round((r1+m)*255); const g=Math.round((g1+m)*255); const b=Math.round((b1+m)*255); return {r,g,b}; }
    const rgb=hslToRgb(h,s,l); const hsv = rgbToHsv(rgb.r,rgb.g,rgb.b); setHsv(hsv.h, hsv.s, hsv.v); }
});

// copy buttons
function addCopyHandler(id, getText){ const btn = document.getElementById(id); btn.addEventListener('click', async () => { const text = getText(); try { await navigator.clipboard.writeText(text); btn.textContent = 'Copied!'; setTimeout(()=>btn.textContent = id.startsWith('copy-') ? id.replace('copy-','Copy ').trim() : 'Copy', 1200); } catch(e){ alert('Could not copy: ' + text); } }); }
addCopyHandler('copy-hex', () => hexInput.value);
addCopyHandler('copy-rgb', () => rgbInput.value);
addCopyHandler('copy-hsl', () => hslInput.value);

// keyboard input on canvas for accessibility
canvas.addEventListener('keydown', (e)=>{ if(e.key === 'ArrowUp'){ setHsv(state.h, state.s, clamp(state.v + 0.05,0,1)); } else if(e.key === 'ArrowDown'){ setHsv(state.h, state.s, clamp(state.v - 0.05,0,1)); } else if(e.key === 'ArrowLeft'){ setHsv(state.h, clamp(state.s - 0.05,0,1), state.v); } else if(e.key === 'ArrowRight'){ setHsv(state.h, clamp(state.s + 0.05,0,1), state.v); } });

// initialization
function init(){ setHsv(0,1,1); drawSV(); updateUI(); renderHistory(); }
init();

// end of script.js
