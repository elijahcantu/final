import React, { useState, useMemo } from 'react'
import ColorCanvas from './components/ColorCanvas'
import HueSlider from './components/HueSlider'
import ColorPreview from './components/ColorPreview'
import ColorCodeInputs from './components/ColorCodeInputs'
import PaletteList from './components/PaletteList'
import History from './components/History'
import ContrastChecker from './components/ContrastChecker'
import { hsvToRgb, rgbToHex, rgbToHsl, rgbToHsv, hexToRgb } from './utils/color'
import './App.css'

export default function App(){
  const [h, setH] = useState(0);
  const [s, setS] = useState(1);
  const [v, setV] = useState(1);
  const rgb = useMemo(()=> hsvToRgb(h, s, v), [h,s,v]);
  const hex = useMemo(()=> rgbToHex(rgb.r, rgb.g, rgb.b), [rgb]);
  const hsl = useMemo(()=> rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);

  const [history, setHistory] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('react_cp_history') || '[]'); } catch{ return []; }
  });
  function onPick(newS, newV){ setS(newS); setV(newV); }
  function onPickEnd(newS, newV){ // add current color to history on pointerup
    const rgb = hsvToRgb(h, newS, newV); const hex = rgbToHex(rgb.r, rgb.g, rgb.b); if(history[0] !== hex){ const copy = [hex, ...history].slice(0,20); setHistory(copy); localStorage.setItem('react_cp_history', JSON.stringify(copy)); }
  }
  function onHue(newH){ setH(newH); }
  function updateFromRgb(r,g,b){ const hsv = rgbToHsv(r,g,b); setH(hsv.h); setS(hsv.s); setV(hsv.v);
    // add to history when user changes colors via input
    const hex = rgbToHex(r,g,b); if(history[0] !== hex){ const copy = [hex, ...history].slice(0,20); setHistory(copy); localStorage.setItem('react_cp_history', JSON.stringify(copy)); }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>React Color Picker</h1>
        <div className="author">Elijah Cantu (<span className="uniqname">e.cantu</span>)</div>
      </header>
      <div className="picker">
        <div className="left">
          <ColorCanvas hue={h} onPick={onPick} onPickEnd={onPickEnd} s={s} v={v} />
          <HueSlider hue={h} onHue={onHue} />
        </div>
        <aside className="right">
          <ColorPreview rgb={rgb} hex={hex} />
          <ColorCodeInputs rgb={rgb} hex={hex} hsl={hsl} onSetRgb={updateFromRgb} />
          <div className="palettes">
            <h3>Palettes</h3>
            <PaletteList h={h} s={s} v={v} onUse={({h})=>setH(h)} />
          </div>
          <div className="history-section">
            <h3>History</h3>
            <History history={history} onUse={(hex)=>{ const rgb = hexToRgb(hex); if(rgb){ const hsv = rgbToHsv(rgb.r,rgb.g,rgb.b); setH(hsv.h); setS(hsv.s); setV(hsv.v); } }} />
          </div>
          <ContrastChecker rgb={rgb} />
        </aside>
      </div>
    </div>
  )
}
