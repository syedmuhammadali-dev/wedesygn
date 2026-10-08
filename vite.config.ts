import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  publicDir: 'assets',
  // Appended to the unhashed /js/*.js URLs so browsers never keep a stale copy after a deploy.
  define: { __BUILD_ID__: JSON.stringify(Date.now().toString(36)) },
  server: {
    fs: {
      allow: ['..'],
    },
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
