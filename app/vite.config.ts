import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // относительные пути: работает на любом адресе GitHub Pages
  plugins: [react()],
})
