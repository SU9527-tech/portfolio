<template>
  <div class="bg-decor" aria-hidden="true">
    <span class="blob blob-1"></span>
    <span class="blob blob-2"></span>
    <span class="dot-grid"></span>
  </div>

  <SiteNav />

  <main class="main">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>

  <SiteFooter />
</template>

<script setup>
import SiteNav from './components/SiteNav.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<style scoped>
.main { min-height: 60vh; }
</style>
