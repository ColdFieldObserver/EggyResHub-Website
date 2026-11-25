<script setup lang="ts">
import type { LinkItem } from '#shared/types/resource';

// 友情链接 / 社区推广的列表项：图片图标 + 标题 + 描述。
// 外链一律新标签页打开（与正文站外链接规则一致）。
// 用 Vuetify VCard + link/ripple，自带点击涟漪与主题配色。
const props = defineProps<{ item: LinkItem }>();
</script>

<template>
  <VCard
    :href="props.item.href"
    target="_blank"
    rel="noopener noreferrer"
    link
    ripple
    variant="outlined"
    class="link-card"
  >
    <div class="link-card__inner">
      <div class="link-card__icon">
        <Icon :name="props.item.icon" size="28" aria-hidden="true" />
      </div>
      <div class="link-card__body">
        <h3 class="link-card__title">
          {{ props.item.title }}
          <Icon name="mdi:open-in-new" size="13" aria-hidden="true" />
        </h3>
        <p class="link-card__desc">{{ props.item.description }}</p>
      </div>
    </div>
  </VCard>
</template>

<style scoped lang="scss">
.link-card__inner {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
}
.link-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 48px;
  height: 48px;
  color: rgb(var(--v-theme-primary));
  background: rgb(var(--v-theme-primary) / 0.1);
  border-radius: $radius-sm;
}
.link-card__body {
  min-width: 0;
}
.link-card__title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.98rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}
.link-card__desc {
  margin-top: 4px;
  font-size: 0.85rem;
  line-height: 1.55;
  color: rgb(var(--v-theme-on-surface) / 0.65);
}
</style>
