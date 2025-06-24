import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@mui/x-date-pickers'],
          'vendor-utils': ['dayjs', 'framer-motion'],
          'dashboard': ['./src/Pages/Dashboard/Dashboard'],
          'analytics': ['./src/Pages/Analytics/AnalyticsDashboard'],
          'auth': ['./src/Pages/Auth/SignIn']
        },
      },
    },
  },
})
