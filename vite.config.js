import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Metamorphosen/',
  // Avoid EACCES on rename when running from WSL on NTFS (/mnt/d/); use Linux fs for cache
  ...(process.env.WSL_DISTRO_NAME && { cacheDir: '/tmp/metamorphosen-vite' }),
})
