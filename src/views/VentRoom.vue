<template>
  <div class="vent">
    <header class="vent-head">
      <h1>🔨 打工人发泄室</h1>
      <p class="sub">说出去的话，碎纸机吃了，砖头碎了，泡泡破了 —— 一个字都不留</p>
    </header>

    <!-- 碎纸机 -->
    <section class="card">
      <h2>📝 打字发泄 · 碎纸机</h2>
      <p class="note">想骂啥骂啥，写完点「粉碎」，一个字都不保存、不上传、不留痕。纯本地。</p>
      <textarea ref="ventText" placeholder="把今天受的气全打出来……比如：劳动合同都不给，还赶人？！"></textarea>
      <div class="row">
        <button class="btn-danger" @click="shred">💥 粉碎它</button>
        <button class="btn-ghost" @click="clearVent">清空</button>
      </div>
      <canvas ref="shredCanvas" class="shred-canvas"></canvas>
    </section>

    <!-- 今日宜摸鱼 -->
    <section class="card">
      <h2>🎴 今日宜摸鱼 · 签文</h2>
      <p class="note">每天一签，纯属娱乐，改不了命但能改改心情。</p>
      <div ref="fortune" class="fortune">
        <div class="f-line">今日宜：<b>{{ yi }}</b></div>
        <div class="f-line">今日忌：<b>{{ ji }}</b></div>
        <div class="f-sign">签：<b>{{ sign }}</b></div>
        <div class="f-soup">{{ soup }}</div>
      </div>
      <div class="row">
        <button class="btn-ghost" @click="draw(true)">🎲 再抽一签</button>
      </div>
    </section>

    <!-- 拍砖 -->
    <section class="card brick-card">
      <h2>🧱 拍砖 · 解气计数</h2>
      <div class="brick" @click="hitBrick">🧱</div>
      <p class="counter">今日已拍砖 <b>{{ brickN }}</b> 块 · 老板已挨 <b>{{ bossN }}</b> 下</p>
    </section>

    <!-- 捏泡泡 -->
    <section class="card">
      <h2>🫧 捏泡泡 · 减压</h2>
      <div ref="bubbleField" class="bubble-field"></div>
      <div class="row">
        <button class="btn-ghost" @click="addBubbles(8)">再冒一泡</button>
        <span class="counter">已捏破 <b>{{ popN }}</b> 个</span>
      </div>
    </section>

    <footer class="vent-foot">
      这是给打工人的情绪出口，不是真去砸谁家玻璃 🤝<br>
      所有文字只在你浏览器本地处理，不上传、不保存。
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const ventText = ref(null)
const shredCanvas = ref(null)
const fortune = ref(null)
const bubbleField = ref(null)

const yi = ref('—')
const ji = ref('—')
const sign = ref('—')
const soup = ref('—')
const brickN = ref(0)
const bossN = ref(0)
const popN = ref(0)

// ---- 音效（Web Audio，零外部文件）----
let actx
function audio() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)()
  return actx
}
function playThud() {
  const c = audio(); const o = c.createOscillator(); const g = c.createGain()
  o.type = 'sine'; o.frequency.setValueAtTime(160, c.currentTime)
  o.frequency.exponentialRampToValueAtTime(50, c.currentTime + 0.18)
  g.gain.setValueAtTime(0.5, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25)
  o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.26)
}
function playPop() {
  const c = audio(); const o = c.createOscillator(); const g = c.createGain()
  o.type = 'triangle'; o.frequency.setValueAtTime(700 + Math.random() * 400, c.currentTime)
  g.gain.setValueAtTime(0.25, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12)
  o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.13)
}
function playShred() {
  const c = audio(); const dur = 0.7
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2)
  const src = c.createBufferSource(); src.buffer = buf
  const g = c.createGain(); g.gain.value = 0.22
  const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = 0.7
  src.connect(f); f.connect(g); g.connect(c.destination); src.start()
}

// ---- 碎纸机 ----
let cctx = null, cssW = 0, strips = []
function wrapText(ctx, text, maxW) {
  const out = []
  text.split('\n').forEach(par => {
    let cur = ''
    for (const ch of par) {
      const test = cur + ch
      if (ctx.measureText(test).width > maxW && cur) { out.push(cur); cur = ch }
      else cur = test
    }
    out.push(cur)
  })
  return out
}
function renderPaper(text) {
  const fs = 18, pad = 14, lineH = fs * 1.5, maxW = Math.min(cssW - 24, 520)
  const lines = wrapText(cctx, text, maxW)
  const w = Math.min(cssW - 20, Math.max(160, Math.min(...lines.map(l => cctx.measureText(l).width)) + pad * 2))
  const h = lines.length * lineH + pad * 2
  const off = document.createElement('canvas'); off.width = w; off.height = h
  const o = off.getContext('2d')
  o.fillStyle = '#f5f5fa'; o.fillRect(0, 0, w, h)
  o.fillStyle = '#1c1c28'; o.font = fs + 'px sans-serif'; o.textBaseline = 'top'
  lines.forEach((l, i) => o.fillText(l, pad, pad + i * lineH))
  return { canvas: off, w, h }
}
function drawMouth(y) {
  cctx.fillStyle = 'rgba(0,0,0,0.22)'; cctx.fillRect(0, y - 7, cssW, 16)
  cctx.fillStyle = 'rgba(0,0,0,0.5)'
  for (let x = 0; x < cssW; x += 9) cctx.fillRect(x, y - 3, 3, 11)
}
function shred() {
  const txt = ventText.value.value.trim()
  if (!txt) { alert('先打点字再粉碎啊，憋着更伤身'); return }
  const canvas = shredCanvas.value
  canvas.style.display = 'block'
  const dpr = window.devicePixelRatio || 1
  cssW = canvas.clientWidth; const cssH = 240
  canvas.width = cssW * dpr; canvas.height = cssH * dpr
  cctx = canvas.getContext('2d'); cctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const { canvas: paper, w, h } = renderPaper(txt)
  ventText.value.value = ''
  const mouthY = 40, stripW = 7, startX = (cssW - w) / 2
  strips = []
  for (let sx = 0; sx < w; sx += stripW) {
    strips.push({
      sx, sw: Math.min(stripW, w - sx), x: startX + sx, y: mouthY - 3,
      rot: (Math.random() - 0.5) * 0.25, vy: 1.3 + Math.random() * 1.1,
      vx: (Math.random() - 0.5) * 0.7, vr: (Math.random() - 0.5) * 0.05, life: 1
    })
  }
  playShred()
  animateShred(paper, mouthY, h)
}
function animateShred(paper, mouthY, ph) {
  cctx.clearRect(0, 0, cssW, 240); drawMouth(mouthY)
  let alive = false
  strips.forEach(s => {
    if (s.life <= 0) return
    alive = true
    s.y += s.vy; s.vy += 0.12; s.x += s.vx; s.rot += s.vr; s.life -= 0.011
    cctx.save(); cctx.globalAlpha = Math.max(0, s.life)
    cctx.translate(s.x + s.sw / 2, s.y); cctx.rotate(s.rot)
    cctx.drawImage(paper, s.sx, 0, s.sw, ph, -s.sw / 2, 0, s.sw, ph)
    cctx.restore()
  })
  cctx.globalAlpha = 1
  if (alive) requestAnimationFrame(() => animateShred(paper, mouthY, ph))
}
function clearVent() { ventText.value.value = '' }

// ---- 今日宜摸鱼 · 签文 ----
const yiArr = ['摸鱼', '带薪如厕', '假装打字', '准时下班', '甩锅给需求', '合理划水', '咖啡续命', '摸鱼式健身', '把需求打回重做', '假装开会']
const jiArr = ['加班', '背锅', '画饼', '无偿奉献', '深夜回消息', '内卷', '主动揽活', '把老板当人', '周末秒回', '接锅']
const signs = [
  { t: '大吉', d: '今日宜准时溜，天意如此' },
  { t: '中吉', d: '摸鱼有度，进可攻退可守' },
  { t: '小吉', d: '宜装忙，忌真忙' },
  { t: '平', d: '今日宜苟住，别出头' },
  { t: '凶', d: '今日宜装病，忌硬撑' }
]
const soups = [
  '工资涨不涨不知道，发际线一定在涨',
  '打工人的福报，就是福气都被老板报了',
  '你可以摸鱼，但别让鱼摸你',
  '今天也要做一个情绪稳定的打工人（假的）',
  '老板画的饼太硬，建议拿去垫桌脚',
  '只要我不上心，就没有什么能伤到我'
]
function daySeed() { const d = new Date(); return d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate() }
function draw(rand) {
  const seed = rand ? Math.floor(Math.random() * 99999) : daySeed()
  yi.value = yiArr[seed % yiArr.length]
  ji.value = jiArr[seed % jiArr.length]
  const s = signs[seed % signs.length]
  sign.value = s.t + ' —— ' + s.d
  soup.value = '「' + soups[seed % soups.length] + '」'
  const el = fortune.value
  el.classList.remove('fade-in'); void el.offsetWidth; el.classList.add('fade-in')
}

// ---- 拍砖 ----
function hitBrick() { brickN.value++; bossN.value++; playThud() }

// ---- 捏泡泡 ----
function spawnBubbles(n) {
  const field = bubbleField.value
  if (!field) return
  for (let i = 0; i < n; i++) {
    const b = document.createElement('div'); b.className = 'bubble'
    b.style.left = Math.random() * (field.clientWidth - 54) + 'px'
    b.style.top = Math.random() * (field.clientHeight - 54) + 'px'
    b.style.animationDelay = (Math.random() * 2) + 's'
    b.onclick = () => {
      popN.value++
      const pop = document.createElement('div'); pop.className = 'pop'; pop.textContent = '啵~'
      pop.style.left = b.style.left; pop.style.top = b.style.top
      field.appendChild(pop); setTimeout(() => pop.remove(), 800)
      b.remove(); playPop()
    }
    field.appendChild(b)
  }
}
function addBubbles(n) { spawnBubbles(n) }

onMounted(() => { draw(false); spawnBubbles(12) })
</script>

<style scoped>
.vent { max-width: 880px; margin: 0 auto; padding: 32px 22px 24px; display: grid; gap: 20px }
.vent-head h1 { font-size: 30px; text-align: center; letter-spacing: 1px }
.vent-head .sub { text-align: center; color: var(--text-muted); font-size: 13px; margin-top: 8px }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow-sm) }
.card h2 { font-size: 16px; margin-bottom: 12px; color: var(--accent-2); display: flex; align-items: center; gap: 8px }
.note { background: var(--accent-soft); padding: 10px 14px; border-radius: 8px; font-size: 13px; color: var(--text-muted); line-height: 1.7; margin-bottom: 12px }
textarea { width: 100%; height: 110px; background: var(--surface-2); color: var(--text); border: 1px solid var(--border);
  border-radius: 10px; padding: 12px; font-size: 15px; resize: none; line-height: 1.5; font-family: inherit }
textarea:focus { outline: none; border-color: var(--accent-2) }
.row { display: flex; gap: 10px; margin-top: 12px; flex-wrap: wrap; align-items: center }
button { cursor: pointer; border: none; border-radius: 10px; padding: 11px 18px; font-size: 14px; font-weight: 600;
  transition: transform .08s ease, filter .15s ease; color: #fff }
button:active { transform: scale(.94) }
.btn-danger { background: var(--accent) }
.btn-ghost { background: var(--surface-2); color: var(--text); border: 1px solid var(--border) }
.shred-canvas { width: 100%; height: 240px; background: var(--surface-2); border-radius: 10px; margin-top: 12px; display: none }
.fortune { background: var(--surface-2); border-radius: 10px; padding: 16px; margin-top: 12px; line-height: 2; font-size: 15px; min-height: 120px }
.fortune b { color: var(--accent-2) }
.f-sign { font-size: 18px; margin-top: 6px }
.f-sign b { color: var(--accent) }
.f-soup { margin-top: 10px; color: var(--text-muted); font-size: 13px; font-style: italic }
.fade-in { animation: fadeIn .5s ease }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
.brick-card { text-align: center; padding: 10px 0 }
.brick { display: inline-block; font-size: 64px; cursor: pointer; user-select: none; transition: transform .05s }
.brick:active { transform: scale(.9) rotate(-3deg) }
.counter { font-size: 13px; color: var(--text-muted); margin-top: 8px }
.counter b { color: var(--accent) }
.bubble-field { position: relative; height: 240px; background: var(--surface-2); border-radius: 10px; margin-top: 12px; overflow: hidden }
.bubble { position: absolute; width: 54px; height: 54px; border-radius: 50%; cursor: pointer;
  background: radial-gradient(circle at 32% 30%, var(--accent-2), var(--accent)); opacity: .9;
  box-shadow: inset 0 0 10px rgba(255, 255, 255, .4); animation: float 4s ease-in-out infinite }
@keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
.pop { position: absolute; font-size: 18px; color: var(--accent); pointer-events: none; animation: rise .8s ease-out forwards }
@keyframes rise { from { opacity: 1; transform: translateY(0) } to { opacity: 0; transform: translateY(-40px) } }
.vent-foot { text-align: center; color: var(--text-muted); font-size: 12px; line-height: 1.7 }
</style>
