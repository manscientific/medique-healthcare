import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration file for MediQue Frontend
// Defines plugins and development server settings

export default defineConfig({
  // React plugin enables JSX support and fast refresh
  plugins: [react()],

  // Development server configuration
  server: {
    // Port on which the frontend application runs
    port: 5173,
  },
})
//Necessary comments are made to help others to understand the code!
