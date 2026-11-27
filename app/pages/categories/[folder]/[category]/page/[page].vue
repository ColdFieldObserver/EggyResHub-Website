<script setup lang="ts">
import { computed } from 'vue';
import { useCategoryView } from '~/composables/useResources';
import { folderLabel } from '~/data/folders';

// 分类三层结构 · 第三层分页：/categories/<folder>/<category>/page/<n>
const route = useRoute();
const folder = () => String(route.params.folder ?? '');
const category = () => String(route.params.category ?? '');
const page = computed(() => Number(route.params.page) || 1);
const { title, summary, source } = useCategoryView(folder, category);
</script>

<template>
  <ResourceListView
    :title="title"
    :summary="summary"
    :source="source"
    :page="page"
    :base-path="`/categories/${folder()}/${encodeURIComponent(category())}`"
    :back-to="`/categories/${folder()}`"
    :back-label="`返回 ${folderLabel(folder())}`"
  />
</template>
