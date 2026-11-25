<script setup lang="ts">
import { computed } from 'vue';
import { useAllResources, collectTerms } from '~/composables/useResources';

const all = useAllResources();
const terms = computed(() => collectTerms('tags', all.value));
</script>

<template>
  <div class="page-shell">
    <header class="reveal-item">
      <h1 class="text-h4 font-weight-bold mb-1">资源标签</h1>
      <p class="muted-text text-body-2">共 {{ terms.length }} 个标签</p>
    </header>

    <div class="tag-cloud reveal-item">
      <VChip
        v-for="term in terms"
        :key="term.name"
        :to="term.path"
        link
        ripple
        variant="outlined"
        class="tag-chip"
      >
        <Icon name="mdi:tag-multiple-outline" size="15" aria-hidden="true" class="mr-1" />
        {{ term.name }}
        <span class="tag-chip__count">{{ term.count }}</span>
      </VChip>
    </div>
    <p v-if="!terms.length" class="muted-text mt-6">暂无标签。</p>
  </div>
</template>

<style scoped lang="scss">
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}
.tag-chip__count {
  margin-left: 6px;
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface) / 0.5);
}
</style>
