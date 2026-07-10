import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base: './' 让构建产物使用相对路径，
// 这样 dist/ 可以直接拖到 GitHub Pages / Vercel，或任意子目录部署。
export default defineConfig({
  base: './',
  plugins: [vue()],
})
