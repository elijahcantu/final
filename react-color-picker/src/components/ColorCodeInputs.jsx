import React, { useState, useEffect } from 'react'

export default function ColorCodeInputs({ rgb, hex, hsl, onSetRgb }){
  const [hexIn, setHexIn] = useState(hex);
  const [copied, setCopied] = useState('');

  useEffect(()=>{ setHexIn(hex); }, [hex]);

  function applyHex(){ const h = hexIn.trim(); const m = h.replace('#',''); if(m.length===6){ const r = parseInt(m.substring(0,2),16); const g = parseInt(m.substring(2,4),16); const b = parseInt(m.substring(4,6),16); onSetRgb(r,g,b); } }

  async function copyToClipboard(text, which){ try{ await navigator.clipboard.writeText(text); setCopied(which); setTimeout(()=>setCopied(''), 1200); }catch(e){ console.warn('copy failed', e); } }

  return (
    <div className="code-inputs">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label>HEX <input value={hexIn} onChange={e=>setHexIn(e.target.value)} onBlur={applyHex} /></label>
        <button onClick={()=>copyToClipboard(hexIn, 'hex')}>{copied === 'hex' ? 'Copied' : 'Copy'}</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label>RGB <input value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} readOnly /></label>
        <button onClick={()=>copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}>{copied === 'rgb' ? 'Copied' : 'Copy'}</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label>HSL <input value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} readOnly /></label>
        <button onClick={()=>copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}>{copied === 'hsl' ? 'Copied' : 'Copy'}</button>
      </div>
    </div>
  )
}
