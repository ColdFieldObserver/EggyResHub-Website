<script setup lang="ts">
import { computed } from 'vue';
import { useCategoryView } from '~/composables/useResources';
import { folderLabel } from '~/data/folders';

// 分类三层结构 · 第三层：文件夹 + 分类下的文章列表
const route = useRoute();
const folder = () => String(route.params.folder ?? '');
const category = () => String(route.params.category ?? '');
// [category].vue 是分页子路由的父路由：命中 page 时只渲染子页。
const isPageRoute = computed(() => Boolean(route.params.page));
const { title, summary, source } = useCategoryView(folder, category);
</script>

<template>
  <div>
    <NuxtPage v-if="isPageRoute" :page-key="route.fullPath" />
    <Transition name="page">
      <ResourceListView
        v-if="!isPageRoute"
        :key="route.fullPath"
        :title="title"
        :summary="summary"
        :source="source"
        :page="1"
        :base-path="`/categories/${folder()}/${encodeURIComponent(category())}`"
        :back-to="`/categories/${folder()}`"
        :back-label="`返回 ${folderLabel(folder())}`"
      />
    </Transition>
  </div>
</template>
