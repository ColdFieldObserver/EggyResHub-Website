<script setup lang="ts">
import { computed } from 'vue';
import { useAllResources, listFolders } from '~/composables/useResources';

// 分类三层结构 · 第一层：文件夹（content/<folder>/）
const all = useAllResources();
const folders = computed(() => listFolders(all.value));
const total = computed(() => folders.value.reduce((sum, item) => sum + item.count, 0));
</script>

<template>
  <div class="page-shell">
    <header class="reveal-item">
      <h1 class="text-h4 font-weight-bold mb-1">资源分类</h1>
      <p class="muted-text text-body-2">共 {{ folders.length }} 个文件夹 · {{ total }} 个资源</p>
    </header>

    <!-- 第一层：文件夹 → 点进去看该文件夹下的分类 -->
    <h2 class="section-heading reveal-item">
      <Icon name="mdi:folder-multiple-outline" size="24" aria-hidden="true" />
      按文件夹浏览
    </h2>
    <div class="term-grid reveal-item">
      <VCard
        v-for="folder in folders"
        :key="folder.folder"
        :to="folder.path"
        link
        ripple
        variant="outlined"
        class="term-card"
      >
        <div class="term-card__inner">
          <Icon :name="folder.icon" size="26" aria-hidden="true" />
          <span class="term-card__name">{{ folder.label }}</span>
          <span v-if="folder.description" class="term-card__desc">{{ folder.description }}</span>
          <span class="term-card__count">
            {{ folder.categoryCount }} 个分类 · {{ folder.count }} 个资源
          </span>
        </div>
      </VCard>
    </div>
    <p v-if="!folders.length" class="muted-text mt-6">暂无分类。</p>
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
.term-card__desc {
  font-size: 0.8rem;
  color: rgba(var(--v-theme-on-surface), 0.62);
}
.term-card__count {
  font-size: 0.8rem;
  color: rgba(var(--v-theme-on-surface), 0.55);
}
</style>
