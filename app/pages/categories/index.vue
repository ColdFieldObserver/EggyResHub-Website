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

    <!-- 分类完全来自资源 frontmatter 的 categories 字段 -->
    <h2 class="section-heading reveal-item">
      <Icon name="mdi:tag-multiple-outline" size="24" aria-hidden="true" />
      全部标签分类
    </h2>
    <div class="term-grid reveal-item">
      <VCard
        v-for="term in terms"
        :key="term.name"
        :to="term.path"
        link
        ripple
        variant="outlined"
        class="term-card"
      >
        <div class="term-card__inner">
          <Icon name="mdi:folder-multiple-outline" size="26" aria-hidden="true" />
          <span class="term-card__name">{{ term.name }}</span>
          <span class="term-card__count">{{ term.count }} 个资源</span>
        </div>
      </VCard>
    </div>
    <p v-if="!terms.length" class="muted-text mt-6">暂无分类。</p>
  </div>
</template>

<style scoped lang="scss">
.term-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
  gap: $card-gap;
  margin-top: 16px;
  margin-bottom: 24px;
}
.term-card {
  :deep(.v-card__loader) {
    display: none;
  }
}
.term-card__inner {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px;

  :deep(svg),
  svg {
    color: rgb(var(--v-theme-primary));
  }
}
.term-card__name {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}
.term-card__count {
  font-size: 0.8rem;
  color: rgba(var(--v-theme-on-surface), 0.55);
}
</style>
