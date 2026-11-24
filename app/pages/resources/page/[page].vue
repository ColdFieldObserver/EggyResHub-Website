<script setup lang="ts">
import { useAllResources, pinnedFirst } from '~/composables/useResources';

const route = useRoute();
const page = computed(() => Number(route.params.page) || 1);
const all = useAllResources();
const source = () => pinnedFirst(all.value);
</script>

<template>
  <ResourceListView
    title="全部资源"
    summary="按发布时间排列，置顶资源优先"
    :source="source"
    :page="page"
    base-path="/resources"
  />
</template>
