<template>
  <article class="card work-card" v-reveal>
    <div class="card-cover" :class="`cover-${category}`">
      <img v-show="coverReady" :src="coverSrc" :alt="project.title" @error="coverReady = false" />
      <div v-if="!coverReady" class="cover-fallback">
        <span class="cover-cat">{{ catLabel }}</span>
      </div>
    </div>
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
import { computed, ref } from 'vue'

const props = defineProps({
  project: { type: Object, required: true },
  // 分类（来自 ProjectArchive 的 CAT_MAP），用于占位色块与标签
  category: { type: String, default: 'tool' },
})

// 封面：约定放在 public/projects/<id>.png；加载失败则回退到分类色块占位
const coverReady = ref(true)
const coverSrc = import.meta.env.BASE_URL + 'projects/' + props.project.id + '.png'

// 分类 → 占位标签
const CAT_LABELS_SHORT = {
  fullstack: '全栈',
  backend: '后端',
  frontend: '前端',
  desktop: '桌面',
  tool: '工具',
}
const catLabel = computed(() => CAT_LABELS_SHORT[props.category] || '项目')

// 状态 → 配色（面试时一眼分清进行中 / 已完成）
const statusClass = computed(() => {
  const s = props.project.status || ''
  if (s.includes('进行')) return 'st-progress'
  if (s.includes('持续')) return 'st-ongoing'
  return 'st-done'
})
</script>
