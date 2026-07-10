<template>
  <article class="card" v-reveal>
    <div class="card-meta">
      <time :datetime="project.date">{{ project.date }}</time>
      <span class="card-author">练手项目</span>
    </div>
    <h3 class="card-title">
      <router-link :to="`/project/${project.id}`">{{ project.title }}</router-link>
    </h3>
    <p class="card-excerpt">{{ project.excerpt }}</p>
    <div class="card-tags">
      <span class="tag" v-for="t in project.tags" :key="t">{{ t }}</span>
    </div>
  </article>
</template>

<script setup>
defineProps({
  project: { type: Object, required: true },
})
</script>
