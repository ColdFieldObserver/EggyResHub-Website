<script setup lang="ts">
import { useCategoryView } from '~/composables/useResources';

const route = useRoute();
const name = () => String(route.params.name ?? '');
const page = computed(() => Number(route.params.page) || 1);
const { title, summary, source } = useCategoryView(name);
</script>

<template>
  <ResourceListView
    :title="title"
    :summary="summary"
    :source="source"
    :page="page"
    :base-path="`/categories/${encodeURIComponent(name())}`"
  />
</template>
