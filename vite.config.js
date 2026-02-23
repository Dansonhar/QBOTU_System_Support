import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/QBOTU_System_Support_Web/',
  build: {
    chunkSizeWarningLimit: 600, // Slightly increase limit
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate files to avoid one massive bundle
          vendor: ['react', 'react-dom', 'react-router-dom'],
          lucide: ['lucide-react'],
          quill: ['quill'],
          i18n: ['i18next', 'react-i18next']
        }
      }
    }
  }
})
