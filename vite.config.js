import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base is './' so the built static site works from any sub-path
// (GitHub Pages project pages, etc.) without extra config.
export default defineConfig({
  plugins: [react()],
  base: './',
})
