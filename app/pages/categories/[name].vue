<script setup lang="ts">
import { useCategoryView } from '~/composables/useResources';

const route = useRoute();
const name = () => String(route.params.name ?? '');
const { title, summary, source } = useCategoryView(name);
</script>

<template>
  <ResourceListView
    :title="title"
    :summary="summary"
    :source="source"
    :page="1"
    :base-path="`/categories/${encodeURIComponent(name())}`"
  />
</template>
