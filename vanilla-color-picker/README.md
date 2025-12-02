Vanilla Color Picker
====================
A vanilla JavaScript color picker that replicates features of https://htmlcolorcodes.com/color-picker/.

Features
- SV (Saturation / Value) picker canvas with high-DPI support
- Hue slider
- HEX / RGB / HSL display and editing
- Palette generation (triadic, complementary, analogous examples)
- Contrast ratio check against black and white (WCAG guidance)
- Color history saved to localStorage
- Accessible keyboard support for SV canvas

How to run
1. Open `index.html` in a browser by opening the file directly, or run a simple static server:

```bash
python -m http.server 8000
# or (node):
# npx http-server -p 8000
```

2. Visit `http://localhost:8000/vanilla-color-picker/` in your browser.

Files
- `index.html` — main page
- `style.css` — styles
- `script.js` — main app logic

Deployment (recommended)
- GitHub Pages: This repo includes a GitHub Actions workflow that deploys `vanilla-color-picker/` and `react-color-picker/dist/` to the `gh-pages` branch. After pushing to your repo, visit the URLs:
	- Vanilla: https://<YOUR_GITHUB_USERNAME>.github.io/final/vanilla-color-picker/
	- React: https://<YOUR_GITHUB_USERNAME>.github.io/final/react-color-picker/
- Netlify: Connect the repo and set the publish directory to `vanilla-color-picker/` for the static version.

Notes
- This app is intentionally minimal and demonstrates the main interactive features required by the assignment. You can extend it with more palette generation, export, or eyedropper features.

Author: Elijah Cantu (e.cantu)
