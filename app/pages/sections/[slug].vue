<script setup lang="ts">
import {
  useAllResources,
  useSections,
  filterByTerm,
  pinnedFirst,
} from '~/composables/useResources';

const route = useRoute();
const slug = computed(() => String(route.params.slug ?? ''));
const all = useAllResources();
const sections = useSections();
const meta = computed(() => sections.value.find((s) => s.slug === slug.value));
const source = () => pinnedFirst(filterByTerm(all.value, 'sections', slug.value));
</script>

<template>
  <ResourceListView
    :title="meta?.title ?? slug"
    :summary="meta?.description ?? '该分区下的资源'"
    :source="source"
    :page="1"
    :base-path="`/sections/${slug}`"
  />
</template>
