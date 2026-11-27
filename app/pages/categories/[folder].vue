<script setup lang="ts">
import { computed } from 'vue';
import { useAllResources, collectTermsInFolder } from '~/composables/useResources';
import { folderDescription, folderLabel } from '~/data/folders';

// 分类三层结构 · 第二层：某个文件夹下的分类（content/<folder>/ 的 frontmatter categories）
const route = useRoute();
const folder = computed(() => String(route.params.folder ?? ''));
// [folder].vue 是 [category].vue 的父路由：命中子路由时只渲染子页。
const isCategoryRoute = computed(() => Boolean(route.params.category));
const all = useAllResources();
const terms = computed(() => collectTermsInFolder(all.value, folder.value));
const folderCount = computed(() => all.value.filter((item) => item.folder === folder.value).length);
</script>

<template>
  <NuxtPage v-if="isCategoryRoute" :key="route.fullPath" />
  <div v-else :key="`folder-${folder}`" class="page-shell">
    <header class="reveal-item">
      <VBtn to="/categories" variant="text" density="comfortable" size="small" class="mb-2">
        <Icon name="mdi:chevron-left" size="20" class="mr-1" aria-hidden="true" />
        返回文件夹
      </VBtn>
      <h1 class="text-h4 font-weight-bold mb-1">{{ folderLabel(folder) }}</h1>
      <p class="muted-text text-body-2">
        {{ folderDescription(folder) }}
        <template v-if="folderDescription(folder)"> · </template>共 {{ terms.length }} 个分类 ·
        {{ folderCount }} 个资源
      </p>
    </header>

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
          <Icon name="mdi:folder-multiple-outline" size="24" aria-hidden="true" />
          <span class="term-card__name">{{ term.name }}</span>
          <span class="term-card__count">{{ term.count }} 个资源</span>
        </div>
      </VCard>
    </div>
    <p v-if="!terms.length" class="muted-text mt-6">该文件夹下暂无分类。</p>
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
