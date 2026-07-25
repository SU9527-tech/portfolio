<template>
  <article class="card work-card" v-reveal>
    <div class="card-top">
      <span class="card-status" :class="statusClass">{{ project.status }}</span>
    </div>

    <h3 class="card-title">
      <router-link :to="`/project/${project.id}`">{{ project.title }}</router-link>
    </h3>

    <p class="card-role" v-if="project.role">{{ project.role }}</p>

    <p class="card-excerpt">{{ project.excerpt }}</p>

    <div class="card-tags">
      <span class="tag" v-for="t in project.tags" :key="t">{{ t }}</span>
    </div>

    <router-link :to="`/project/${project.id}`" class="card-more">查看详情 →</router-link>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  project: { type: Object, required: true },
})

// 状态 → 配色（面试时一眼分清进行中 / 已完成）
const statusClass = computed(() => {
  const s = props.project.status || ''
  if (s.includes('进行')) return 'st-progress'
  if (s.includes('持续')) return 'st-ongoing'
  return 'st-done'
})
</script>
