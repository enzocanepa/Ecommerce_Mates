import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router'],
          // Supabase
          'vendor-supabase': ['@supabase/supabase-js'],
          // Radix UI primitives (usados en toda la app)
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-tabs',
          ],
          // Charts (solo usado en AdminDashboard)
          'vendor-charts': ['recharts'],
          // Animation + utils
          'vendor-utils': ['motion', 'sonner', 'clsx', 'tailwind-merge', 'lucide-react'],
        },
      },
    },
  },
})
