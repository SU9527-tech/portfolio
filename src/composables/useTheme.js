import { ref } from 'vue'

const STORAGE_KEY = 'lu-portfolio-theme'
const ORDER = ['light', 'dark', 'system']

// 模块级单例：所有组件共享同一份主题状态
const theme = ref(localStorage.getItem(STORAGE_KEY) || 'system')

function apply(t) {
  const root = document.documentElement
  if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t)
  else root.removeAttribute('data-theme') // system：交给 CSS 的 prefers-color-scheme
}

apply(theme.value)

function setTheme(t) {
  theme.value = t
  localStorage.setItem(STORAGE_KEY, t)
  apply(t)
}

function cycleTheme() {
  setTheme(ORDER[(ORDER.indexOf(theme.value) + 1) % ORDER.length])
}

// 跟随系统：主题处于 system 时，系统偏好变化立即响应
if (window.matchMedia) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', () => {
    if (theme.value === 'system') apply('system')
  })
}

export function useTheme() {
  return { theme, setTheme, cycleTheme }
}
