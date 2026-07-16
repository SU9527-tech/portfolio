<template>
  <header class="nav" :class="{ scrolled }">
    <div class="nav-inner">
      <router-link to="/" class="brand" v-magnetic>
        <span class="brand-mark">陆</span>
        <span class="brand-text">陆工<span class="brand-sub">· 作品集</span></span>
      </router-link>

      <nav class="nav-links" :class="{ open: menuOpen }">
        <a class="nav-link" href="#works" @click.prevent="goSection('works')">作品</a>
        <a class="nav-link" href="#about" @click.prevent="goSection('about')">关于</a>
        <a class="nav-link" href="#contact" @click.prevent="goSection('contact')">联系</a>
        <router-link to="/vent" class="nav-link">发泄室</router-link>
      </nav>

      <div class="nav-actions">
        <ThemeToggle />
        <button class="nav-burger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="菜单">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'

const router = useRouter()
const menuOpen = ref(false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 8
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function goSection(id) {
  menuOpen.value = false
  const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  if (router.currentRoute.value.path === '/') {
    scroll()
  } else {
    router.push('/').then(() => setTimeout(scroll, 140))
  }
}
</script>
