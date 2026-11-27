<script setup lang="ts">
import type { Resource } from '#shared/types/resource';

// 文章卡片：封面通栏 16:9 + 三行信息（标题 / 分类·日期 / 摘要）。
// 结构对齐 PidanUI 官网 PostCard：正文区自上而下排列、顶部对齐，
// 卡片用 VCard 承载（:to 走客户端路由，ripple 提供点击涟漪）。
const props = withDefaults(defineProps<{ resource: Resource; compact?: boolean }>(), {
  compact: false,
});
</script>

<template>
  <VCard
    :to="props.resource.path"
    link
    ripple
    variant="outlined"
    rounded="lg"
    class="resource-card"
  >
    <VImg
      :src="props.resource.cover"
      :alt="props.resource.title"
      aspect-ratio="16/9"
      cover
      class="resource-card__cover"
    />
    <div class="resource-card__body">
      <h3 class="resource-card__title">{{ props.resource.title }}</h3>
      <div class="resource-card__meta">
        <template v-if="props.resource.categories.length">
          <span class="resource-card__cat">{{ props.resource.categories[0] }}</span>
          <span aria-hidden="true">·</span>
        </template>
        <span class="resource-card__date">
          <Icon name="mdi:calendar-blank" size="13" aria-hidden="true" />
          {{ props.resource.displayDate }}
        </span>
      </div>
      <p v-if="!props.compact" class="resource-card__desc">{{ props.resource.description }}</p>
    </div>
  </VCard>
</template>

<style scoped lang="scss">
.resource-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.resource-card__cover {
  flex-shrink: 0;
  width: 100%;
  // 封面统一固定 16:9：不随原始图片比例变化，卡片高度因此一致
  aspect-ratio: 16 / 9;
  overflow: hidden;
}
// 正文区：自上而下排列、贴顶对齐（与 PidanUI 官网 PostCard 一致）
.resource-card__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 12px;
  padding: 20px;
}
.resource-card__title {
  display: -webkit-box;
  margin: 0;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  color: rgb(var(--v-theme-on-surface));
}
.resource-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: rgba(var(--v-theme-on-surface), 0.55);
}
.resource-card__cat {
  font-weight: 500;
  color: rgb(var(--v-theme-primary));
}
.resource-card__date {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.resource-card__desc {
  display: -webkit-box;
  margin: 0;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.85rem;
  line-height: 1.7;
  color: rgba(var(--v-theme-on-surface), 0.7);
}
</style>
