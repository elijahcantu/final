import React from 'react'

export default function HueSlider({ hue=0, onHue }){
  return (
    <div className="hue-wrap" style={{height:300, display:'flex', alignItems:'center'}}>
      <input type="range" min="0" max="360" value={hue} onChange={(e)=>onHue(Number(e.target.value))} style={{transform:'rotate(-90deg)', width:300}} aria-label="Hue slider" />
    </div>
  )
}
