<template>
  <div class="skill-radar-wrap" ref="wrapRef">
    <div class="skill-radar-header">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 21 8.5 17.5 20 6.5 20 2 8.5" />
        <circle cx="12" cy="12.5" r="3" />
      </svg>
      能力矩阵 · 自评
    </div>
    <div class="skill-radar" ref="chartRef"></div>
    <p class="skill-radar-note">评分为当前阶段主观自评，梯度真实、不夸大</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useTheme } from '../composables/useTheme'
import { skillRadar } from '../data/skills'

echarts.use([RadarChart, TooltipComponent, CanvasRenderer])

const chartRef = ref(null)
const wrapRef = ref(null)
let chart = null
let io = null
let mqDark = null

const { theme } = useTheme()
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function buildOption() {
  const accent = cssVar('--accent') || '#4f46e5'
  const textMuted = cssVar('--text-muted') || '#6b7280'
  const text = cssVar('--text') || '#16181d'
  const border = cssVar('--border') || 'rgba(20,24,29,0.08)'
  const surface = cssVar('--surface') || '#fff'
  return {
    animation: !reduceMotion,
    animationDuration: 700,
    tooltip: {
      trigger: 'item',
      backgroundColor: surface,
      borderColor: border,
      textStyle: { color: text, fontSize: 12 },
      formatter: () => skillRadar.map((s) => `${s.name}　${s.value}`).join('<br/>'),
    },
    radar: {
      indicator: skillRadar.map((s) => ({ name: s.name, max: 100 })),
      shape: 'polygon',
      splitNumber: 4,
      radius: '66%',
      center: ['50%', '54%'],
      axisName: { color: textMuted, fontSize: 12, fontWeight: 600 },
      splitLine: { lineStyle: { color: border } },
      axisLine: { lineStyle: { color: border } },
      splitArea: { areaStyle: { color: ['transparent', 'transparent'] } },
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { color: accent, width: 2 },
        itemStyle: { color: accent },
        areaStyle: { color: accent + '2e' },
        emphasis: { areaStyle: { opacity: 0.35 } },
        data: [
          {
            value: skillRadar.map((s) => s.value),
            name: '自评能力',
            label: { show: true, color: text, fontSize: 11, fontWeight: 600 },
          },
        ],
      },
    ],
  }
}

function render() {
  if (chart) chart.setOption(buildOption())
}

function onThemeChange() {
  // 等一帧，确保 data-theme 已应用、CSS 变量已更新
  requestAnimationFrame(render)
}

function onResize() {
  if (chart) chart.resize()
}

onMounted(() => {
  io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        wrapRef.value?.classList.add('revealed')
        io.disconnect()
      }
    },
    { threshold: 0.15 }
  )
  if (wrapRef.value) io.observe(wrapRef.value)

  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    render()
  }
  window.addEventListener('resize', onResize)
  watch(theme, onThemeChange)
  mqDark = window.matchMedia('(prefers-color-scheme: dark)')
  mqDark.addEventListener('change', onThemeChange)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  if (mqDark) mqDark.removeEventListener('change', onThemeChange)
  if (io) io.disconnect()
  if (chart) {
    chart.dispose()
    chart = null
  }
})
</script>

<style scoped>
.skill-radar-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 0;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  /* 自身有 echarts 动画，不用 v-reveal 的 transform；仅做 opacity 渐显 */
  opacity: 0;
  transition: opacity 0.7s ease;
}
.skill-radar-wrap.revealed { opacity: 1; }
.skill-radar-header {
  display: flex; align-items: center; gap: 8px;
  font-size: 15px; font-weight: 700; color: var(--text);
  padding: 16px 22px; border-bottom: 1px solid var(--border);
}
.skill-radar-header svg { color: var(--accent); flex-shrink: 0; }
.skill-radar { width: 100%; height: 320px; }
.skill-radar-note {
  padding: 0 22px 16px; margin: 0;
  font-size: 12px; color: var(--text-faint);
}
</style>
