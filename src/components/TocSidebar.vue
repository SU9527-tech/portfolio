<template>
  <div class="side-card toc-card">
    <div class="side-title">目录</div>
    <ul class="toc-list">
      <li v-for="item in items" :key="item.id">
        <a
          :href="'#' + item.id"
          :class="{ active: item.id === active }"
          @click.prevent="emit('select', item.id)"
          >{{ item.text }}</a
        >
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  active: { type: String, default: '' },
})
const emit = defineEmits(['select'])
</script>
