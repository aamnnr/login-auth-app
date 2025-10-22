import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  test: {
    globals: true, // Mengaktifkan global (seperti 'test', 'expect')
    environment: 'jsdom', // Menggunakan jsdom untuk simulasi browser
    // File setup untuk jest-dom (dibuat di langkah 3)
    setupFiles: './tests/setupTests.js', 
  },
})
