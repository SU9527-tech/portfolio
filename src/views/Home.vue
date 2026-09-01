<template>
  <div>
    <!-- Hero -->
    <section class="hero" v-reveal>
      <p class="hero-eyebrow">你好，我是</p>
      <h1 class="hero-title">陆<span class="gradient-text">工</span></h1>
      <p class="hero-role">.NET / C# 开发者 · 工业软件 / MES 方向</p>
      <p class="hero-desc">
        主攻 C#/.NET，做过 MES 系统与车间上位机。这里沉淀了我的项目实践——
        设备监控、车间客户端、报表接口，从桌面端到后端都能落地。
      </p>
      <div class="hero-cta">
        <a class="btn btn-primary magnetic" v-magnetic href="#works" @click.prevent="scrollTo('works')">查看作品</a>
        <a class="btn btn-ghost magnetic" v-magnetic href="#contact" @click.prevent="scrollTo('contact')">联系我</a>
      </div>
      <ul class="hero-stats">
        <li><strong>{{ projects.length }}</strong><span>个项目</span></li>
        <li><strong>2025–2026</strong><span>学习跨度</span></li>
        <li><strong>.NET 8</strong><span>主攻技术栈</span></li>
      </ul>
    </section>

    <ProjectArchive />

    <!-- 关于 -->
    <section class="about" id="about" v-reveal>
      <div class="about-grid">
        <div class="about-bio">
          <h2 class="section-title">关于我</h2>
          <p>
            我叫陆工，2026 届计算机本科。上一份工作在昆山兢美电子做软件开发，参与
            <b>MES 系统</b>与 <b>WPF 车间上位机</b>的开发；此前在东软实习做过 Java + Vue 全栈。
            当前求职方向：工业软件 / MES / 上位机开发。
          </p>
          <p>
            这个站点是我的<b>项目沉淀</b>：把练习和实战项目整理成可展示的形态，既方便自己回顾，
            也方便面试官快速了解我的技术栈与完成度。
          </p>
          <p>
            技术栈：C#/.NET 8（ASP.NET Core、Dapper、DDD 四层）、WPF + MVVM、SQL Server / MySQL、
            Java / Spring Boot 双栈；也在用 Spring AI 做 RAG 应用。
          </p>
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
        <p class="section-sub">正在求职工业软件 / MES / 上位机方向，有合适的岗位欢迎联系，也接受内推。</p>
        <div class="contact-links">
          <a class="btn btn-primary magnetic" v-magnetic href="mailto:1840214075@qq.com">发邮件</a>
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
