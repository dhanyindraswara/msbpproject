import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base is './' so the built static site works from any sub-path
// (GitHub Pages project pages, etc.) without extra config.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // Firebase is lazy-loaded into its own chunk on purpose; it is large but no
    // longer blocks first paint, so don't warn about it.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Keep React in a separate, long-lived cache chunk.
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})
