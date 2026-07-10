<template>
  <div class="tag-cloud-wrap" ref="wrapRef">
    <div class="tag-cloud-header">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
        <circle cx="7" cy="7" r="1.2" fill="currentColor" stroke="none" />
      </svg>
      我的标签
    </div>
    <div class="tag-cloud" ref="cloud">
      <a
        v-for="(t, i) in tags"
        :key="i"
        class="float-tag"
        :class="[t.color, { hovered: hoveredIdx === i }]"
        :href="t.link"
        target="_blank"
        rel="noopener noreferrer"
        :title="'查看「' + t.label + '」相关内容'"
        @mouseenter="hoveredIdx = i"
        @mouseleave="hoveredIdx = -1"
        ref="els"
      >
        <span class="tag-icon">{{ t.icon }}</span>{{ t.label }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const tags = [
  { label: 'C#',       icon: 'C', color: 'tag-blue',   link: 'https://github.com/search?q=language%3AC%23+created%3A%3E2025-01-01&type=repositories' },
  { label: '.NET',     icon: 'N', color: 'tag-purple',  link: 'https://learn.microsoft.com/zh-cn/dotnet/' },
  { label: 'Vue',      icon: 'V', color: 'tag-green',   link: 'https://cn.vuejs.org/' },
  { label: 'WebAPI',   icon: 'W', color: 'tag-cyan',    link: 'https://learn.microsoft.com/zh-cn/aspnet/core/web-api/' },
  { label: 'SQL Server', icon:'S', color: 'tag-orange', link: 'https://learn.microsoft.com/zh-cn/sql/sql-server/' },
  { label: 'Git',      icon: 'G', color: 'tag-red',     link: 'https://git-scm.com/doc' },
  { label: 'WinForms', icon: 'W', color: 'tag-indigo',  link: 'https://learn.microsoft.com/zh-cn/dotnet/desktop/winforms/overview/' },
  { label: 'WPF',      icon: 'W', color: 'tag-teal',    link: 'https://learn.microsoft.com/zh-cn/dotnet/desktop/wpf/overview/' },
  { label: 'MES',      icon: 'M', color: 'tag-pink',    link: 'https://en.wikipedia.org/wiki/Manufacturing_execution_system' },
  { label: 'PLC',      icon: 'P', color: 'tag-amber',   link: 'https://en.wikipedia.org/wiki/Programmable_logic_controller' },
  { label: 'DeviceMonitor', icon:'D', color: 'tag-blue', link: 'https://github.com/SU9527-tech?tab=repositories&q=device' },
  { label: 'HTML/CSS', icon: '#', color: 'tag-cyan',    link: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS' },
  { label: 'DDD',      icon: 'D', color: 'tag-purple',  link: 'https://docs.microsoft.com/en-us/azure/architecture/patterns/category/domain-driven-design' },
  { label: '部署',     icon: '↑', color: 'tag-orange',  link: 'https://vercel.com' },
  { label: '内网穿透', icon: '↔', color: 'tag-green',  link: 'https://ngrok.com' },
  { label: 'AI工具',   icon: '★', color: 'tag-pink',   link: 'https://github.com/features/ai' },
  { label: 'Linux',    icon: 'L', color: 'tag-red',     link: 'https://www.l.org/linux101/' },
  { label: '学习',     icon: '✦', color: 'tag-indigo', link: 'https://github.com/SU9527-tech?tab=repositories' },
]

const cloud = ref(null)
const wrapRef = ref(null)
const els = ref([])
const hoveredIdx = ref(-1)
let raf = 0
let particles = []

// 每个标签独立的正弦波漂移参数（互不干扰）
function makeParticle(el) {
  return {
    el,
    baseX: 0,
    baseY: 0,
    // 每个标签不同的相位、频率、幅度，看起来自然随机
    phaseX: Math.random() * Math.PI * 2,
    phaseY: Math.random() * Math.PI * 2,
    freqX: 0.0008 + Math.random() * 0.0012,   // 横向飘动频率
    freqY: 0.0006 + Math.random() * 0.001,    // 纵向飘动频率
    ampX: 18 + Math.random() * 22,             // 横向振幅 px
    ampY: 14 + Math.random() * 16,             // 纵向振幅 px
    // 额外的极慢整体漂移（让布局不完全静止）
    driftX: (Math.random() - 0.5) * 4,
    driftY: (Math.random() - 0.5) * 3,
  }
}

onMounted(() => {
  // 纯 opacity 渐显
  const io = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) { wrapRef.value?.classList.add('revealed'); io.disconnect() } },
    { threshold: 0.15 }
  )
  if (wrapRef.value) io.observe(wrapRef.value)

  const container = cloud.value
  if (!container) return
  const W = container.clientWidth
  const H = container.clientHeight

  const list = els.value || []
  particles = list.map((el, idx) => {
    const r = el.getBoundingClientRect()
    const w = r.width
    const h = r.height
    // 用网格+随机偏移做初始散布，避免重叠
    const cols = 3
    const cellW = W / cols
    const cellH = H / Math.ceil(list.length / cols)
    const col = idx % cols
    const row = Math.floor(idx / cols)
    const x = col * cellW + cellW / 2 - w / 2 + (Math.random() - 0.5) * (cellW * 0.5)
    const y = row * cellH + cellH / 2 - h / 2 + (Math.random() - 0.5) * (cellH * 0.4)

    const p = makeParticle(el)
    p.baseX = clamp(x, 4, W - w - 4)
    p.baseY = clamp(y, 4, H - h - 4)
    p.w = w
    p.h = h
    return p
  })

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }

  function step(ts) {
    for (const p of particles) {
      const dx = Math.sin(ts * p.freqX + p.phaseX) * p.ampX + p.driftX
      const dy = Math.cos(ts * p.freqY + p.phaseY) * p.ampY + p.driftY
      const fx = clamp(p.baseX + dx, 2, W - p.w - 2)
      const fy = clamp(p.baseY + dy, 2, H - p.h - 2)
      p.el.style.transform = `translate3d(${fx}px, ${fy}px, 0)`
    }
    raf = requestAnimationFrame(step)
  }

  // 初始位置先写一次
  for (const p of particles) {
    p.el.style.transform = `translate3d(${p.baseX}px, ${p.baseY}px, 0)`
  }
  raf = requestAnimationFrame(step)
})

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
})
</script>
