<script setup lang="ts">
import { useAllResources, filterByTerm, pinnedFirst } from '~/composables/useResources';

const route = useRoute();
const name = computed(() => String(route.params.name ?? ''));
const all = useAllResources();
const source = () => pinnedFirst(filterByTerm(all.value, 'categories', name.value));
</script>

<template>
  <ResourceListView
    :title="`分类：${name}`"
    summary="该分类下的资源"
    :source="source"
    :page="1"
    :base-path="`/categories/${encodeURIComponent(name)}`"
  />
</template>
