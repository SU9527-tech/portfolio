import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { reveal } from './directives/reveal'
import { magnetic } from './directives/magnetic'
// 本地引入 Inter 字体（替代 Google Fonts CDN，国内访问稳定、秒开不回退系统字体）
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import './style.css'

const app = createApp(App)
app.use(router)
app.directive('reveal', reveal)
app.directive('magnetic', magnetic)
app.mount('#app')
