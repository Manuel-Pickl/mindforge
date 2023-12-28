import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      sass: {
        // Include global styles here
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
})
