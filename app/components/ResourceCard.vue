<script setup lang="ts">
import type { Resource } from '#shared/types/resource';

// 文章卡片：封面图 + 标题 + 发布日期 + 摘要。
// 站内链接一律用 NuxtLink，避免整页刷新丢失页面过渡。
const props = withDefaults(defineProps<{ resource: Resource; compact?: boolean }>(), {
  compact: false,
});
</script>

<template>
  <NuxtLink :to="props.resource.path" class="resource-card">
    <img
      class="resource-card__cover"
      :src="props.resource.cover"
      :alt="props.resource.title"
      loading="lazy"
    />
    <div class="resource-card__body">
      <h3 class="resource-card__title">{{ props.resource.title }}</h3>
      <p class="resource-card__meta">
        <Icon name="mdi:calendar-blank" size="13" aria-hidden="true" />
        {{ props.resource.displayDate }}
        <span v-if="props.resource.categories.length"> · {{ props.resource.categories[0] }}</span>
      </p>
      <p v-if="!props.compact" class="resource-card__desc">{{ props.resource.description }}</p>
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
.resource-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  background: rgb(var(--v-theme-surface));
}
.resource-card__body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px 16px;
}
.resource-card__meta {
  display: flex;
  align-items: center;
  gap: 4px;
}
.resource-card__desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
a.resource-card:hover .resource-card__title {
  color: rgb(var(--v-theme-primary));
}
</style>
