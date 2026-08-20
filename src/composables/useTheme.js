import { ref } from 'vue'

const STORAGE_KEY = 'lu-portfolio-theme'
const ORDER = ['light', 'dark']

function isClient() {
  return typeof localStorage !== 'undefined' && typeof window !== 'undefined'
}

function getSavedTheme() {
  if (!isClient()) return null
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function setSavedTheme(t) {
  if (!isClient()) return
  try {
    localStorage.setItem(STORAGE_KEY, t)
  } catch {}
}

// 初始化主题：兼容旧版本可能存的 'system'，若不存在则按系统偏好给一次默认值
function initialTheme() {
  const saved = getSavedTheme()
  if (ORDER.includes(saved)) return saved
  if (isClient() && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

// 模块级单例：所有组件共享同一份主题状态
const theme = ref(initialTheme())

function apply(t) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', t)
  }
}

apply(theme.value)

function setTheme(t) {
  if (!ORDER.includes(t)) return
  theme.value = t
  setSavedTheme(t)
  apply(t)
}

function cycleTheme() {
  setTheme(ORDER[(ORDER.indexOf(theme.value) + 1) % ORDER.length])
}

export function useTheme() {
  return { theme, setTheme, cycleTheme }
}
