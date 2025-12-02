React Color Picker (Vite + React)

A React implementation of the Color Picker (based on the Vanilla JS version provided). This app demonstrates a canvas-based SV picker, hue slider, code inputs, palette generation, and WCAG contrast checker.

How to run
1. Install dependencies:

```bash
cd react-color-picker
npm install
```

2. Run dev server:

```bash
npm run dev
```

3. Open http://localhost:5173/ (Vite default) to view.

Build & Deploy
- Build with `npm run build` and deploy `dist` to Netlify or GitHub Pages.
 - If using GitHub Pages (we've included an Action): the built React app will be copied to `gh-pages/react-color-picker` by the workflow and published. The usage assumes the top-level repo name is `final` and the username is your GitHub username. React asset base is set to relative paths with `base: './'` in `vite.config.js` so it works from a subfolder.

Structurej
- `src/components` holds the primary components (Canvas, Slider, Inputs)
- `src/utils/color.js` contains conversion functions with tests

Test
- Run `npm run test` (vitest)

Author: Elijah Cantu (e.cantu)
