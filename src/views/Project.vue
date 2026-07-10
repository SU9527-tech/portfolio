<template>
  <article class="article-wrap" v-if="project" :style="{ '--accent-h': accentH }">
    <router-link to="/" class="back-link">← 返回作品集</router-link>

    <!-- 头图 -->
    <header class="article-hero">
      <div class="hero-inner">
        <span class="hero-status">{{ project.status }}</span>
        <h1 class="article-title">{{ project.title }}</h1>
        <p class="article-subtitle">{{ project.subtitle || project.excerpt }}</p>
        <div class="hero-meta">
          <span>📅 {{ project.date }}</span>
          <span v-if="project.role">👤 {{ project.role }}</span>
        </div>
        <div class="hero-tech">
          <span class="chip" v-for="t in project.tags" :key="t">{{ t }}</span>
        </div>
      </div>
    </header>

    <div class="article-layout">
      <div class="article-main">
        <!-- 亮点卡片 -->
        <div class="article-highlight" v-if="project.highlight">
          <span class="hl-icon">💡</span>
          <p>{{ project.highlight }}</p>
        </div>

        <!-- 正文（分区渲染） -->
        <div class="article-body">
          <template v-for="(s, i) in project.sections" :key="i">
            <h2 v-if="s.type === 'h2'" :id="h2Id(s)" v-html="inline(s.text)"></h2>
            <h3 v-else-if="s.type === 'h3'" v-html="inline(s.text)"></h3>
            <p v-else-if="s.type === 'p'" v-html="inline(s.text)"></p>
            <ul v-else-if="s.type === 'ul'">
              <li v-for="(it, k) in s.items" :key="k" v-html="inline(it)"></li>
            </ul>
            <ol v-else-if="s.type === 'ol'">
              <li v-for="(it, k) in s.items" :key="k" v-html="inline(it)"></li>
            </ol>
            <pre v-else-if="s.type === 'code'"><code>{{ s.code }}</code></pre>
            <blockquote v-else-if="s.type === 'blockquote'" v-html="inline(s.text)"></blockquote>
            <hr v-else-if="s.type === 'hr'" />
          </template>
        </div>

        <!-- 标签 -->
        <div class="article-tags">
          <span class="tag" v-for="t in project.tags" :key="t">{{ t }}</span>
        </div>

        <!-- 上一篇 / 下一篇 -->
        <nav class="article-nav">
          <router-link v-if="prev" class="prev" :to="`/project/${prev.id}`">
            <div class="label">← 上一篇</div>
            <div class="ttl">{{ prev.title }}</div>
          </router-link>
          <span v-else></span>
          <router-link v-if="next" class="next" :to="`/project/${next.id}`">
            <div class="label">下一篇 →</div>
            <div class="ttl">{{ next.title }}</div>
          </router-link>
          <span v-else></span>
        </nav>
      </div>

      <!-- 侧边栏：目录 + 项目信息 -->
      <aside class="article-side">
        <TocSidebar :items="toc" :active="activeId" @select="scrollToSection" />
        <div class="side-card meta-card">
          <div class="side-title">项目信息</div>
          <ul class="meta-list">
            <li><span class="k">日期</span><span class="v">{{ project.date }}</span></li>
            <li><span class="k">状态</span><span class="v">{{ project.status }}</span></li>
            <li v-if="project.role"><span class="k">角色</span><span class="v">{{ project.role }}</span></li>
            <li v-if="project.github"><span class="k">源码</span><span class="v"><a :href="project.github" target="_blank" rel="noopener" class="meta-link">GitHub ↗</a></span></li>
            <li>
              <span class="k">技术栈</span>
              <span class="v tags">
                <span v-for="t in project.tags" :key="t">{{ t }}</span>
              </span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </article>

  <!-- 找不到项目 -->
  <div v-else class="article-wrap">
    <router-link to="/" class="back-link">← 返回作品集</router-link>
    <h1 class="article-title">没有找到这个项目</h1>
    <p class="article-body">
      链接可能已失效，<router-link to="/" style="color: var(--accent); font-weight: 600;">返回首页</router-link>重新选择。
    </p>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { projects, findProject } from '../data/projects'
import TocSidebar from '../components/TocSidebar.vue'

const route = useRoute()
const ACCENT_HUES = [250, 200, 160, 280, 25, 330, 190, 140, 300]

const project = computed(() => findProject(route.params.id))
const idx = computed(() => projects.findIndex((p) => p.id === route.params.id))
const prev = computed(() => (idx.value > 0 ? projects[idx.value - 1] : null))
const next = computed(() =>
  idx.value >= 0 && idx.value < projects.length - 1 ? projects[idx.value + 1] : null
)
const accentH = computed(() =>
  ACCENT_HUES[idx.value >= 0 ? idx.value % ACCENT_HUES.length : 0]
)

// 目录：从 h2 生成稳定 id
const toc = computed(() => {
  if (!project.value) return []
  const list = []
  let n = 0
  for (const s of project.value.sections) {
    if (s.type === 'h2') {
      list.push({ id: 'sec-' + n, text: stripMd(s.text) })
      n++
    }
  }
  return list
})

const activeId = ref('')
let observer = null

function h2Id(s) {
  const i = project.value.sections.filter((x) => x.type === 'h2').indexOf(s)
  return 'sec-' + i
}
function stripMd(t) {
  return String(t).replace(/\*\*/g, '')
}
// **加粗** → <strong>
function inline(t) {
  return String(t)
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) => (i % 2 === 1 ? `<strong>${part}</strong>` : part))
    .join('')
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function setupObserver() {
  if (observer) observer.disconnect()
  const heads = toc.value.map((t) => document.getElementById(t.id)).filter(Boolean)
  if (!heads.length) return
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) activeId.value = e.target.id
      })
    },
    { rootMargin: '-90px 0px -70% 0px', threshold: 0 }
  )
  heads.forEach((h) => observer.observe(h))
}

onMounted(async () => {
  await nextTick()
  setupObserver()
})
watch(
  () => route.params.id,
  async () => {
    activeId.value = ''
    await nextTick()
    setupObserver()
  }
)
onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>
