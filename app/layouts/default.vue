<script setup lang="ts">
// ============================================================
// 全站外壳：吸顶顶栏 + 宽侧边栏 + 主内容。
// - 顶栏最左：菜单按钮 + 站点标题；最右：三态主题 + 搜索栏 + 关于
// - 侧栏承载导航，顶栏菜单按钮全局收起（桌面端默认展开）
// - 保持 Vuetify 默认行为，不做移动端抽屉手势等增强 Hook
// - layout 渲染前先拉一次全站资源与分区数据，供各页与侧栏共用
// ============================================================
import { ref, watch, onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { SITE } from '#shared/site';
import { MAIN_NAV } from '~/data/nav';
import { fetchResources } from '~/composables/useResources';
import { sidebarOpen, toggleSidebar, closeSidebarOnMobile } from '~/composables/useSidebar';
import { useSiteTheme } from '~/composables/useSiteTheme';
import { openSearchDialog } from '~/composables/useSearch';

// 渲染前填充数据（写进 useState，随 payload 序列化）
await fetchResources();

const aboutRef = ref<InstanceType<typeof AboutDialog> | null>(null);
const { resolvedDark, cycle } = useSiteTheme();

// 把三态主题的判断结果同步给 Vuetify 运行时主题（组件颜色）
const vTheme = useTheme();
function syncVuetifyTheme(dark: boolean): void {
  vTheme.global.name.value = dark ? 'dark' : 'light';
}
onMounted(() => {
  syncVuetifyTheme(resolvedDark.value);
  watch(resolvedDark, syncVuetifyTheme);
});

function onOpenSearch(event: MouseEvent): void {
  openSearchDialog(event.currentTarget as HTMLElement);
}

// Ctrl / ⌘ + K 呼出搜索对话框
function onKeydown(event: KeyboardEvent): void {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openSearchDialog();
  }
}
onMounted(() => window.addEventListener('keydown', onKeydown));
</script>

<template>
  <VApp>
    <!-- 顶栏 -->
    <VAppBar flat :height="64" class="app-topbar" color="surface">
      <VBtn
        variant="text"
        density="comfortable"
        class="app-topbar__menu"
        :aria-label="sidebarOpen ? '收起侧边栏' : '展开侧边栏'"
        :aria-expanded="sidebarOpen"
        @click="toggleSidebar"
      >
        <Icon :name="sidebarOpen ? 'mdi:menu-open' : 'mdi:menu'" size="24" aria-hidden="true" />
      </VBtn>

      <NuxtLink to="/" class="app-topbar__brand">
        <span class="app-topbar__title">{{ SITE.brand }}</span>
      </NuxtLink>

      <VSpacer />

      <!-- 搜索栏（点击呼出对话框） -->
      <button
        type="button"
        class="app-topbar__search js-only"
        aria-haspopup="dialog"
        aria-keyshortcuts="Control+K Meta+K"
        @click="onOpenSearch"
      >
        <Icon name="mdi:magnify" size="18" aria-hidden="true" />
        <span class="app-topbar__search-text">搜索资源…</span>
        <kbd class="app-topbar__kbd">Ctrl K</kbd>
      </button>
      <a class="app-topbar__search-fallback" href="/search/" aria-label="打开搜索页">搜索</a>

      <ThemeToggle />

      <VBtn
        variant="text"
        density="comfortable"
        aria-label="关于本站"
        title="关于本站"
        @click="aboutRef?.open()"
      >
        <Icon name="mdi:information-outline" size="20" aria-hidden="true" />
        <span class="app-topbar__about-text">关于</span>
      </VBtn>
    </VAppBar>

    <!-- 左侧边栏（宽侧边栏，全局可收起） -->
    <VNavigationDrawer
      v-model="sidebarOpen"
      :width="260"
      :permanent="false"
      class="app-sidebar"
      color="surface"
    >
      <div class="app-sidebar__inner">
        <p class="app-sidebar__group">站点导航</p>
        <VList density="compact" nav>
          <VListItem
            v-for="item in MAIN_NAV"
            :key="item.to"
            :to="item.to"
            :exact="item.exact"
            :prepend-icon="item.icon"
            :title="item.label"
            @click="closeSidebarOnMobile"
          />
        </VList>
      </div>
    </VNavigationDrawer>

    <!-- 主内容 -->
    <VMain class="app-main">
      <NuxtPage />
    </VMain>

    <!-- 全局对话框 -->
    <SearchDialog />
    <AboutDialog ref="aboutRef" />
  </VApp>
</template>

<style scoped lang="scss">
.app-topbar__brand {
  display: flex;
  align-items: center;
  margin-left: 4px;
  text-decoration: none;
  color: rgb(var(--v-theme-on-surface));
}
.app-topbar__title {
  font-size: 1.05rem;
  font-weight: 700;
  white-space: nowrap;
}
.app-topbar__search {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 240px;
  max-width: 32vw;
  margin-right: 12px;
  padding: 7px 12px;
  font-family: $font-ui;
  font-size: 0.85rem;
  color: rgb(var(--v-theme-on-surface) / 0.6);
  background: rgb(var(--v-theme-surface-variant));
  border: 1px solid rgb(var(--v-theme-on-surface) / 0.1);
  border-radius: 999px;
  cursor: pointer;
  transition: border-color $transition-fast ease;

  &:hover {
    border-color: rgb(var(--v-theme-primary));
  }
}
.app-topbar__search-text {
  flex: 1;
  text-align: left;
}
.app-topbar__kbd {
  padding: 1px 6px;
  font-family: $font-code;
  font-size: 0.7rem;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-on-surface) / 0.14);
  border-radius: 4px;
}
.app-topbar__search-fallback {
  display: none;
  margin-right: 12px;
}
html:not(.js) .app-topbar__search-fallback {
  display: inline;
}
.app-sidebar__inner {
  padding: 16px 12px;
}
.app-sidebar__group {
  padding: 0 12px;
  margin: 8px 0 6px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-on-surface) / 0.5);
}

@media (max-width: $breakpoint-lg) {
  .app-topbar__search-text,
  .app-topbar__kbd,
  .app-topbar__about-text {
    display: none;
  }
  .app-topbar__search {
    width: auto;
    padding: 8px;
  }
}
</style>
