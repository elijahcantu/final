import { describe, it, expect } from 'vitest';
import { rgbToHex, hexToRgb, hsvToRgb, rgbToHsv } from '../src/utils/color';

describe('color utils', () => {
  it('rgbToHex works', () => {
    expect(rgbToHex(255,0,0)).toBe('#FF0000');
    expect(rgbToHex(0,255,0)).toBe('#00FF00');
  });
  it('hexToRgb works', () => {
    expect(hexToRgb('#336699')).toEqual({ r:51, g:102, b:153 });
  });
  it('hsv->rgb roundtrip', ()=>{
    const r = hsvToRgb(0,1,1); expect(r.r).toBe(255);
    const h = rgbToHsv(255,0,0); expect(h.h).toBe(0);
  });
});
