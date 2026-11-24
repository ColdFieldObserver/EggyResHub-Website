<script setup lang="ts">
import { useAllResources, pinnedFirst } from '~/composables/useResources';

const all = useAllResources();
const source = () => pinnedFirst(all.value);
</script>

<template>
  <ResourceListView
    title="全部资源"
    summary="按发布时间排列，置顶资源优先"
    :source="source"
    :page="1"
    base-path="/resources"
  >
    <template #footer>
      <GiscusComments />
    </template>
  </ResourceListView>
</template>
