import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { reveal } from './directives/reveal'
import { magnetic } from './directives/magnetic'
import './style.css'

const app = createApp(App)
app.use(router)
app.directive('reveal', reveal)
app.directive('magnetic', magnetic)
app.mount('#app')
