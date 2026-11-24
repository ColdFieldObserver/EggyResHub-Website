<script setup lang="ts">
import { useSections } from '~/composables/useResources';

const sections = useSections();
</script>

<template>
  <div class="page-shell">
    <header class="reveal-item">
      <h1 class="text-h4 font-weight-bold mb-1">资源分区</h1>
      <p class="muted-text text-body-2">按主题分区浏览全部资源</p>
    </header>

    <div class="link-grid mt-6 reveal-item">
      <NuxtLink
        v-for="section in sections"
        :key="section.slug"
        :to="`/sections/${section.slug}`"
        class="section-card"
      >
        <Icon name="mdi:folder-multiple-outline" size="26" aria-hidden="true" />
        <h3 class="section-card__title">{{ section.title }}</h3>
        <p class="section-card__desc">{{ section.description }}</p>
        <p class="section-card__count">{{ section.count }} 个资源</p>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px;
  text-decoration: none;
  color: rgb(var(--v-theme-on-surface));
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-on-surface) / 0.12);
  border-radius: $radius-md;
  transition: border-color $transition-fast ease;

  &:hover {
    border-color: rgb(var(--v-theme-primary));
  }
  :deep(svg) {
    color: rgb(var(--v-theme-primary));
  }
}
.section-card__title {
  font-size: 1rem;
  font-weight: 600;
}
.section-card__desc {
  font-size: 0.85rem;
  line-height: 1.55;
  color: rgb(var(--v-theme-on-surface) / 0.65);
}
.section-card__count {
  margin-top: auto;
  font-size: 0.78rem;
  color: rgb(var(--v-theme-on-surface) / 0.5);
}
</style>
