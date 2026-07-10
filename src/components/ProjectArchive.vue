<template>
  <section class="works" id="works">
    <div class="section-head">
      <h2 class="section-title">作品归档</h2>
      <p class="section-sub">按时间整理的学习与练手项目</p>
    </div>

    <div class="year-group" v-for="yg in groups" :key="yg.year">
      <div class="year-label"><span>{{ yg.year }}</span></div>
      <div class="month-group" v-for="mg in yg.months" :key="yg.year + '-' + mg.month">
        <div class="month-label">{{ mg.month }} 月</div>
        <div class="card-list">
          <WorkCard v-for="p in mg.items" :key="p.id" :project="p" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import WorkCard from './WorkCard.vue'
import { projects } from '../data/projects'

// 按 年 → 月 分组（与简窝归档形式一致）
const groups = computed(() => {
  const map = {}
  for (const p of projects) {
    const [y, m] = p.date.split('-')
    map[y] = map[y] || {}
    map[y][m] = map[y][m] || []
    map[y][m].push(p)
  }
  return Object.keys(map)
    .sort((a, b) => b - a)
    .map((year) => ({
      year,
      months: Object.keys(map[year])
        .sort((a, b) => b - a)
        .map((month) => ({ month: Number(month), items: map[year][month] })),
    }))
})
</script>
