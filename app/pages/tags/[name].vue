<script setup lang="ts">
import { useAllResources, filterByTerm, pinnedFirst } from '~/composables/useResources';

const route = useRoute();
const name = computed(() => String(route.params.name ?? ''));
const all = useAllResources();
const source = () => pinnedFirst(filterByTerm(all.value, 'tags', name.value));
</script>

<template>
  <ResourceListView
    :title="`标签：#${name}`"
    summary="该标签下的资源"
    :source="source"
    :page="1"
    :base-path="`/tags/${encodeURIComponent(name)}`"
  />
</template>
