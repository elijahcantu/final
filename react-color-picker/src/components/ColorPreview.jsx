import React from 'react'

export default function ColorPreview({ rgb, hex }){
  return (
    <div className="color-preview">
      <div className="preview-box" style={{backgroundColor: hex}}></div>
      <div className="meta">HEX: {hex}<br/>RGB: {rgb.r}, {rgb.g}, {rgb.b}</div>
    </div>
  )
}
