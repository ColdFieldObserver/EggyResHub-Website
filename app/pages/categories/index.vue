<script setup lang="ts">
import { computed } from 'vue';
import { useAllResources, collectTerms } from '~/composables/useResources';

const all = useAllResources();
const terms = computed(() => collectTerms('categories', all.value));
</script>

<template>
  <div class="page-shell">
    <header class="reveal-item">
      <h1 class="text-h4 font-weight-bold mb-1">资源分类</h1>
      <p class="muted-text text-body-2">共 {{ terms.length }} 个分类</p>
    </header>

    <div class="term-grid reveal-item">
      <NuxtLink v-for="term in terms" :key="term.name" :to="term.path" class="term-card">
        <Icon name="mdi:folder-multiple-outline" size="26" aria-hidden="true" />
        <span class="term-card__name">{{ term.name }}</span>
        <span class="term-card__count">{{ term.count }} 个资源</span>
      </NuxtLink>
    </div>
    <p v-if="!terms.length" class="muted-text mt-6">暂无分类。</p>
  </div>
</template>

<style scoped lang="scss">
.term-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
  gap: $card-gap;
  margin-top: 24px;
}
.term-card {
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
.term-card__name {
  font-weight: 600;
}
.term-card__count {
  font-size: 0.8rem;
  color: rgb(var(--v-theme-on-surface) / 0.55);
}
</style>
