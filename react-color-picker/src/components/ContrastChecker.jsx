import React from 'react'
import { contrastRatio } from '../utils/color'

export default function ContrastChecker({ rgb }){
  const ratioWhite = contrastRatio(rgb, {r:255,g:255,b:255});
  const ratioBlack = contrastRatio(rgb, {r:0,g:0,b:0});
  return (
    <div>
      <div>Contrast vs white: {ratioWhite.toFixed(2)}</div>
      <div>Contrast vs black: {ratioBlack.toFixed(2)}</div>
    </div>
  )
}
