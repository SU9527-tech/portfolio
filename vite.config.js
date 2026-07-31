import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base: './' 让构建产物使用相对路径，
// 这样 dist/ 可以直接拖到 GitHub Pages / Vercel，或任意子目录部署。
export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        // 把 echarts 及其依赖 zrender 单独拆成独立 chunk，
        // 避免主包超过 500KB 警告，首屏 JS 更小、加载更快。
        manualChunks(id) {
          if (id.includes('node_modules/echarts') || id.includes('node_modules/zrender')) {
            return 'echarts'
          }
        },
      },
    },
  },
})
