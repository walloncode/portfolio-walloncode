import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Split heavy vendors into their own long-cacheable chunks so the browser
    // fetches them in parallel and reuses them across visits. `three` in
    // particular is only referenced by lazy-loaded WebGL backgrounds, so it
    // falls out of the initial payload entirely.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('three')) return 'three'
          if (id.includes(`${path.sep}ogl${path.sep}`) || /[\\/]ogl[\\/]/.test(id)) return 'ogl'
          if (id.includes('gsap')) return 'gsap'
          if (id.includes(`${path.sep}motion`) || /[\\/]motion[\\/]/.test(id) || id.includes('framer-motion'))
            return 'motion'
          if (id.includes('@tanstack')) return 'query'
          if (
            /[\\/]react-dom[\\/]/.test(id) ||
            /[\\/]react-router/.test(id) ||
            /[\\/]scheduler[\\/]/.test(id) ||
            /[\\/]react[\\/]/.test(id)
          )
            return 'react-vendor'
        },
      },
    },
  },
})
