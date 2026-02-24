import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  let allowedHosts = []
  const apiBase = env.VITE_API_BASE_URL
  if (apiBase) {
    try {
      const url = new URL(apiBase)
      allowedHosts = [url.hostname]
    } catch {
      // ignore malformed URLs; dev server will still run on localhost
    }
  }

  return {
    plugins: [react()],
    server: {
      allowedHosts,
      // optional: if you are also calling backend via https
      cors: true,
    },
  }
})
