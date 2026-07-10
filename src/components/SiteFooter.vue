<template>
  <footer class="footer">
    <p>© {{ year }} 陆工 · 个人作品集</p>
    <p class="footer-note">设计灵感来自简窝（jianwoo.cn）归档形式 · 由 Vue 3 + Vite 手写重构</p>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
