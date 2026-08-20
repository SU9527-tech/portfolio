<template>
  <section class="works" id="works">
    <div class="section-head">
      <h2 class="section-title">作品集</h2>
      <p class="section-sub">精选练手与实战项目 · 点击卡片看细节（共 {{ projects.length }} 个）</p>
    </div>

    <!-- 分类筛选条 -->
    <div class="filter-bar" v-if="cats.length">
      <button
        v-for="c in cats"
        :key="c.key"
        class="filter-chip"
        :class="{ active: selected === c.key }"
        @click="selected = c.key"
      >{{ c.label }}</button>
    </div>

    <!-- 卡片网格 -->
    <div class="works-grid">
      <WorkCard v-for="p in filtered" :key="p.id" :project="p" />
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import WorkCard from './WorkCard.vue'
import { projects } from '../data/projects'

// 项目 id → 分类。以后加了新项目，照着加一行即可（key 对应下面 CAT_LABELS）
const CAT_MAP = {
  shopfloor: 'desktop',        // WPF 车间上位机（结构示意）
  mesreport: 'backend',        // C# WebAPI 报表接口
  mbtigame: 'fullstack',       // Spring Boot 全栈毕设
  webtest: 'frontend',         // Web 基础练手
  myfirstapi: 'backend',       // 第一个 Web API
  dbconn: 'backend',           // C# 连 SQL Server
  winforms: 'desktop',         // WinForms 初探
  devicemonitor: 'desktop',  // .NET 设备监控（真实仓库）
  teamtest: 'tool',            // Git 协作练习
  consoleapp: 'desktop',       // C# 控制台起步
  test: 'tool',                // 综合试验场
  'boke-ui-pipeline': 'tool',  // 波克竞赛作品
  'spring-ai-rag': 'backend',  // Spring AI RAG 问答服务
  'spectrum-viewer': 'desktop',// Electron 桌面应用
}
const CAT_LABELS = {
  all: '全部',
  fullstack: '全栈项目',
  backend: '后端 / API',
  frontend: '前端 / Web',
  desktop: '桌面 / C#',
  tool: '工具 / 竞赛',
}
// 顺序即筛选条从左到右的顺序
const CAT_ORDER = ['all', 'fullstack', 'backend', 'frontend', 'desktop', 'tool']

const selected = ref('all')

// 只显示实际用到的分类
const cats = computed(() => {
  const used = new Set(projects.map((p) => CAT_MAP[p.id] || 'tool'))
  return CAT_ORDER
    .filter((k) => k === 'all' || used.has(k))
    .map((k) => ({ key: k, label: CAT_LABELS[k] }))
})

const filtered = computed(() =>
  selected.value === 'all'
    ? projects
    : projects.filter((p) => (CAT_MAP[p.id] || 'tool') === selected.value)
)
</script>
