import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Project from '../views/Project.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/project/:id', name: 'project', component: Project, props: true },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  // 用 hash 路由：直接双击 dist/index.html 也能跑，无需服务器 rewrite
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router
