import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to './' so built assets use relative paths, allowing serving from
// `https://<username>.github.io/<repo>/react-color-picker/` without changing base
export default defineConfig({ base: './', plugins: [react()] })
