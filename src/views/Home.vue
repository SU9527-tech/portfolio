<template>
  <div>
    <!-- Hero -->
    <section class="hero" v-reveal>
      <p class="hero-eyebrow">你好，我是</p>
      <h1 class="hero-title">陆<span class="gradient-text">工</span></h1>
      <p class="hero-role">.NET / C# 全栈练手 · 边做边学</p>
      <p class="hero-desc">
        这里是我的个人作品集，记录从控制台第一行代码到 Vue 前后端联通的学习轨迹。
        每一个项目都是一次「把黑盒跑通」的练习。
      </p>
      <div class="hero-cta">
        <a class="btn btn-primary magnetic" v-magnetic href="#works" @click.prevent="scrollTo('works')">查看作品</a>
        <a class="btn btn-ghost magnetic" v-magnetic href="#contact" @click.prevent="scrollTo('contact')">联系我</a>
      </div>
      <ul class="hero-stats">
        <li><strong>{{ projects.length }}</strong><span>个项目</span></li>
        <li><strong>2025–2026</strong><span>学习跨度</span></li>
        <li><strong>Vue + C#</strong><span>主攻方向</span></li>
      </ul>
    </section>

    <ProjectArchive />

    <!-- 关于 -->
    <section class="about" id="about" v-reveal>
      <div class="about-grid">
        <div class="about-bio">
          <h2 class="section-title">关于我</h2>
          <p>
            我叫陆工，目前在兢美（苏州/昆山）做软件开发工程师，公司主营
            <b>PLC 上位机 + MES 系统</b>。日常以学习 MES 业务流程和 Vue / C# 技术栈为主。
          </p>
          <p>
            这个站点是我的<b>学习副产物</b>：把练手项目沉淀下来，既方便自己回顾，也作为以后找机会的作品集雏形。
            代码写得糙没关系，<b>学会是目的，项目是手段</b>。
          </p>
          <p>长期目标是靠真本事（架构、业务理解、技术深度、解决问题）走到年薪百万，不靠跳槽涨 title。</p>
        </div>
        <div class="about-skills">
          <h3 class="skills-title">技能图谱</h3>
          <TagCloud />
        </div>
      </div>
    </section>

    <!-- 联系 -->
    <section class="contact" id="contact" v-reveal>
      <div class="contact-card">
        <h2 class="section-title">一起聊聊？</h2>
        <p class="section-sub">有练手项目想法、学习路线交流，或者想内推 / 合作，都欢迎找我。</p>
        <div class="contact-links">
          <a class="btn btn-primary magnetic" v-magnetic href="mailto:you@example.com">发邮件</a>
          <a class="btn btn-ghost magnetic" v-magnetic href="https://github.com/SU9527-tech" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import ProjectArchive from '../components/ProjectArchive.vue'
import TagCloud from '../components/TagCloud.vue'
import { projects } from '../data/projects'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>
