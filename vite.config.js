import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Exactly one default export containing both plugins
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})