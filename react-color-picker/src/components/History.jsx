import React from 'react'

export default function History({ history = [], onUse }){
  return (
    <div className="history" style={{ display:'flex', gap:8, overflowX:'auto', padding:'6px 0' }}>
      {history.map((hex, i) => (
        <div key={i} title={hex} onClick={()=>onUse(hex)} className="history-swatch" style={{ width:28, height:28, background:hex, borderRadius:4, border:'1px solid #ddd', cursor:'pointer', flex:'0 0 auto' }} />
      ))}
    </div>
  )
}
