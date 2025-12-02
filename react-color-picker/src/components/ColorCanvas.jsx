import React, { useEffect, useRef } from 'react'
import { hsvToRgb } from '../utils/color'

export default function ColorCanvas({ hue=0, s=1, v=1, onPick, onPickEnd }){
  const ref = useRef(null);
  const cursorRef = useRef(null);
  useEffect(()=>{
    const canvas = ref.current; const ctx = canvas.getContext('2d');
    function scale(){ const dpr = window.devicePixelRatio || 1; canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
    function draw(){ const w=canvas.clientWidth, h=canvas.clientHeight; const col = hsvToRgb(hue, 1,1); ctx.fillStyle = `rgb(${col.r},${col.g},${col.b})`; ctx.fillRect(0,0,w,h); const g1 = ctx.createLinearGradient(0,0,w,0); g1.addColorStop(0,'#fff'); g1.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle = g1; ctx.fillRect(0,0,w,h); const g2 = ctx.createLinearGradient(0,0,0,h); g2.addColorStop(0,'rgba(0,0,0,0)'); g2.addColorStop(1,'#000'); ctx.fillStyle=g2; ctx.fillRect(0,0,w,h); }
    function onResize(){ scale(); draw(); }
    onResize(); window.addEventListener('resize', onResize);

    let capturing=false;
    function getLocal(e){ const rect = canvas.getBoundingClientRect(); const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left)); const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top)); return { x, y }; }
    let stateS = null; let stateV = null;
    function start(e){ capturing = true; const p = getLocal(e); handle(p); canvas.setPointerCapture(e.pointerId); }
    function move(e){ if(!capturing) return; const p = getLocal(e); handle(p); }
    function end(e){ capturing = false; try{ canvas.releasePointerCapture(e.pointerId); } catch {}; onPickEnd?.(stateS != null ? stateS : s, stateV != null ? stateV : v); }
    function handle(p){ const s = p.x / canvas.clientWidth; const v = 1 - (p.y / canvas.clientHeight); stateS = s; stateV = v; onPick?.(s,v);
      // compute coordinates in px and update cursor position directly for smooth UI
      const x = Math.round(s * canvas.clientWidth);
      const y = Math.round((1 - v) * canvas.clientHeight);
      if(cursorRef.current){
        requestAnimationFrame(()=>{
          cursorRef.current.style.left = `${x}px`;
          cursorRef.current.style.top = `${y}px`;
        });
      }
    }
    canvas.addEventListener('pointerdown', start); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);

    return ()=>{ window.removeEventListener('resize', onResize); canvas.removeEventListener('pointerdown', start); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', end); canvas.removeEventListener('pointercancel', end); }
  }, [hue, onPick]);

  // Sync cursor when s/v props change (e.g., when color set via inputs or programmatically)
  useEffect(()=>{
    const canvas = ref.current;
    if(!canvas || !cursorRef.current) return;
    const x = Math.round(s * canvas.clientWidth);
    const y = Math.round((1 - v) * canvas.clientHeight);
    requestAnimationFrame(()=>{
      cursorRef.current.style.left = `${x}px`;
      cursorRef.current.style.top = `${y}px`;
    });
  }, [s, v]);

  const cursorStyle = { left: `${s * 300}px`, top: `${(1 - v) * 300}px` };
  return (
    <div className="canvas-wrap" style={{ position: 'relative' }}>
      <canvas ref={ref} className="sv-canvas" style={{width: '300px', height: '300px', borderRadius: 6}} aria-label="Saturation/value picker" tabIndex={0}></canvas>
      <div ref={cursorRef} className="cursor" style={cursorStyle} aria-hidden="true" />
    </div>
  )
}
