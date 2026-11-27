<script setup lang="ts">
// 首页（三区块）：
//   顶部 = 小字标题 + 副标题 / 左侧特色轮播 + 右侧最新三条 + 查看全部按钮
//   中部 = 蛋仔小技巧列表（home.ts 定义）
//   下部 = 社交链接
// 风格模仿 SmartTeachNanfang（渐变 Hero + 卡片面板）。
import { SITE, LATEST_COUNT } from '#shared/site';
import { useAllResources, latestResources, stickyResources } from '~/composables/useResources';
import { HOME_TIPS, SOCIAL_LINKS } from '~/data/home';

const all = useAllResources();
const latest = computed(() => latestResources(all.value, LATEST_COUNT));
const sticky = computed(() => stickyResources(all.value));
</script>

<template>
  <div class="home">
    <!-- 顶部区块 -->
    <section class="home-top page-shell">
      <div class="home-heading reveal-item">
        <h1 class="text-h4 font-weight-bold mb-1">{{ SITE.brand }}</h1>
        <p>{{ SITE.tagline }}</p>
      </div>

      <div class="home-top__grid">
        <div class="home-top__carousel reveal-item">
          <FeaturedCarousel :resources="sticky" />
        </div>

        <div class="home-top__latest reveal-item">
          <h2 class="home-panel__title">
            <Icon name="mdi:text-box-outline" size="20" aria-hidden="true" />
            最新资源
          </h2>
          <div class="home-latest__scroll">
            <NuxtLink
              v-for="resource in latest"
              :key="resource.path"
              :to="resource.path"
              class="home-latest__item"
            >
              <span class="home-latest__title">{{ resource.title }}</span>
              <span class="home-latest__date">{{ resource.displayDate }}</span>
            </NuxtLink>
            <p v-if="!latest.length" class="muted-text text-body-2">暂无资源</p>
          </div>
          <VBtn
            to="/resources/"
            variant="tonal"
            color="primary"
            block
            class="mt-4 home-latest__more"
          >
            查看全部资源
            <Icon name="mdi:arrow-right" size="16" class="ml-1" aria-hidden="true" />
          </VBtn>
        </div>
      </div>
    </section>

    <!-- 中部区块：蛋仔小技巧 -->
    <section class="page-shell">
      <h2 class="section-heading reveal-item">
        <Icon name="mdi:lightbulb-outline" size="24" aria-hidden="true" />
        蛋仔小技巧
      </h2>
      <div class="tips-grid reveal-item">
        <div v-for="tip in HOME_TIPS" :key="tip.title" class="tip-card">
          <div class="tip-card__icon">
            <Icon :name="tip.icon" size="22" aria-hidden="true" />
          </div>
          <div>
            <h3 class="tip-card__title">{{ tip.title }}</h3>
            <p class="tip-card__desc">{{ tip.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 下部区块：社交链接 -->
    <section class="page-shell">
      <h2 class="section-heading reveal-item">
        <Icon name="mdi:link-variant" size="24" aria-hidden="true" />
        社交链接
      </h2>
      <div class="home-social reveal-item">
        <a
          v-for="link in SOCIAL_LINKS"
          :key="link.label"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="home-social__item"
          :aria-label="link.label"
        >
          <Icon :name="link.icon" size="22" aria-hidden="true" />
          <span>{{ link.label }}</span>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home-heading {
  padding: 8px 0 20px;
  p {
    margin-top: 4px;
    font-size: 0.9rem;
    color: rgba(var(--v-theme-on-surface), 0.6);
  }
}
.home-top__grid {
  // 轮播与最新资源共用一个高度：内容超出时由最新资源面板内部滚动，
  // 两个容器始终等高，不会因最新条目数量变化把整行撑高。
  --home-panel-height: 420px;

  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  align-items: stretch;
  gap: $card-gap;
}
.home-top__carousel,
.home-top__latest {
  height: var(--home-panel-height);
  min-height: 0;
}
.home-top__latest {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 18px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: $radius-lg;
}
.home-panel__title {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 1rem;
  font-weight: 700;
}
.home-latest__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(var(--v-theme-on-surface), 0.24);
    border-radius: 999px;
  }
}
.home-latest__more {
  flex: 0 0 auto;
}
.home-latest__item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 4px;
  text-decoration: none;
  color: rgb(var(--v-theme-on-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  &:hover .home-latest__title {
    color: rgb(var(--v-theme-primary));
  }
}
.home-latest__title {
  font-size: 0.9rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.home-latest__date {
  flex: 0 0 auto;
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.5);
}
.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: $card-gap;
}
.tip-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: $radius-md;
}
.tip-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 40px;
  height: 40px;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: $radius-sm;
}
.tip-card__title {
  font-size: 0.95rem;
  font-weight: 600;
}
.tip-card__desc {
  margin-top: 4px;
  font-size: 0.85rem;
  line-height: 1.6;
  color: rgba(var(--v-theme-on-surface), 0.65);
}
.home-social {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.home-social__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  text-decoration: none;
  font-size: 0.9rem;
  color: rgb(var(--v-theme-on-surface));
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 999px;
  transition: border-color $transition-fast ease;
  &:hover {
    border-color: rgb(var(--v-theme-primary));
  }
}

@media (max-width: $breakpoint-lg) {
  .home-top__grid {
    --home-panel-height: auto;
    grid-template-columns: 1fr;
  }
  // 窄屏堆叠时不需要等高，最新资源恢复完整展开、不出现内部滚动条。
  .home-top__carousel,
  .home-top__latest {
    height: auto;
  }
  .home-latest__scroll {
    overflow-y: visible;
    padding-right: 0;
  }
}
</style>
