Color Picker Final Project
==========================

This workspace contains two implementations of a color picker app, suitable for the class assignment:

- `vanilla-color-picker/`: A plain JavaScript implementation using an HTML canvas for the Saturation/Value plane and an input-range hue slider.
- `react-color-picker/`: A React + Vite implementation with the same features organized as React components.

Both apps include:
- Color selection via canvas (click + drag)
- Hue slider for hue selection
- HEX / RGB / HSL display and editable inputs
- Palette generation (triadic, complementary, analogous)
- WCAG contrast checks
- Color history (vanilla - localStorage)
- Author name and uniqname included in the UI

How to run locally
------------------
Vanilla:

```bash
# Run a static web server (python) from the repo root
python -m http.server 8000
# Open: http://localhost:8000/vanilla-color-picker/
```

React (Vite):

```bash
cd react-color-picker
npm install
npm run dev
# Open: http://localhost:5173/
```

Testing
-------
- Vanilla: `node vanilla-color-picker/test-utils.js` runs a small Node script testing color conversion functions.
- React: `cd react-color-picker && npm run test` (Vitest) checks color utils.

Deployment
----------
- GitHub Pages (auto-deploy): This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that:
	- Builds the React app (`react-color-picker`), copies the vanilla static folder (`vanilla-color-picker/`), and publishes both to the `gh-pages` branch.
	- The workflow runs automatically on pushes to `main`.
	- URLs for the hosted apps will be:
		- Vanilla: https://<YOUR_GITHUB_USERNAME>.github.io/final/vanilla-color-picker/
		- React: https://<YOUR_GITHUB_USERNAME>.github.io/final/react-color-picker/
	- To enable this workflow, push your `main` branch to your GitHub remote repository and verify Actions are enabled for the repo. You do not need to store any additional secrets; the Action uses the repository's `GITHUB_TOKEN`.

- Netlify: Connect repo and set build commands (React: `npm run build`, publish `dist`; Vanilla: just host static assets or use `index.html` root).

Author: Elijah Cantu (e.cantu)

Notes & Suggestions
-------------------
To satisfy the assignment and grading rubric:
- Deploy both apps online (Netlify or GitHub Pages). Keep the author name visible.
- Ensure the interactive features work on desktop and mobile.
- Add tests and accessibility adjustments as needed (ARIA labels, keyboard handlers).

If you want, I can continue by:
- Implementing additional features (color pick from image, OKLCH conversions, more palettes).
- Setting up GitHub Actions to automatically deploy to GitHub Pages.
- Building a CI/CD flow for Netlify.

