import React from 'react'
import { hsvToRgb, rgbToHex } from '../utils/color'

export default function PaletteList({ h, s=1, v=1, onUse }){
  const offsets = [0, 180, 120, -120, 30, -30];
  const setUse = (hue)=> onUse?.({h:hue});
  return (
    <div className="palette-list">
      {offsets.map((off,i) => {
        const hue = (h + off + 360) % 360; const rgb = hsvToRgb(hue, s, v); const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        return <div key={i} onClick={()=>setUse(hue)} title={hex} style={{width:40,height:40,background:hex,borderRadius:6,cursor:'pointer'}} />
      })}
    </div>
  )
}
