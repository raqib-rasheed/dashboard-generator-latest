import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import pluginChecker from 'vite-plugin-checker'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import { antdDayjs } from 'antd-dayjs-vite-plugin'
import eslintPlugin from 'vite-plugin-eslint'

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return {
    build: {
      outDir: 'build',
    },
    plugins: [
      react(),
      pluginChecker({ typescript: true }),
      svgr({ svgrOptions: { icon: true } }),
      tsconfigPaths(),
      antdDayjs(),
      eslintPlugin({
        cache: false,
        include: ['./src/**/*.ts', './src/**/*.tsx'],
        exclude: [],
      }),
    ],
    server: {
      open: true,
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL,
          changeOrigin: true,
        },
        '/accounts': {
          target: process.env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
  }
})
