<script setup lang="ts">
// Giscus 评论：客户端按路由动态注入脚本，兼容 SPA 导航。
// - 懒初始化：滚到附近（rootMargin 400px）才拉取第三方脚本，减少首屏开销
// - 骨架占位：iframe 就绪前保持视觉填充
// - 配色跟随站点主题：手动切换深浅色时通过 postMessage 同步
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { GISCUS, SITE } from '#shared/site';
import { initTheme, onThemeChange, resolvedDark } from '~/composables/useSiteTheme';

const route = useRoute();
const container = ref<HTMLElement | null>(null);
const loading = ref(true);

const GISCUS_ORIGIN = 'https://giscus.app';

let observer: MutationObserver | null = null;
let visibilityObserver: IntersectionObserver | null = null;
let stopThemeWatch: (() => void) | null = null;
let fallbackTimer: number | null = null;

/** 当前应使用的品牌样式表（绝对地址，giscus 只接受公网可访问 URL）。
 * 用当前 https 源而非写死域名，天然免疫域名迁移 / Workers 预览域。
 * Cloudflare Workers 静态资源默认不带 CORS，需 public/_headers 给 /giscus/* 补 ACAO。 */
function giscusTheme(): string {
  const theme = resolvedDark.value ? 'dark' : 'light';
  const origin = typeof window === 'undefined' ? '' : window.location.origin;
  const base = origin.startsWith('https://') ? origin : SITE.mainUrl;
  return new URL(`/giscus/${theme}.css`, `${base}/`).href;
}

/** 已加载的 iframe 无法改属性，需通过 postMessage 通知其切换配色 */
function syncGiscusTheme(): void {
  const frame = container.value?.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
  frame?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: giscusTheme() } } },
    GISCUS_ORIGIN,
  );
}

function clearFallback(): void {
  if (fallbackTimer !== null) {
    window.clearTimeout(fallbackTimer);
    fallbackTimer = null;
  }
}

function mountGiscus(): void {
  const el = container.value;
  if (!el) return;
  el.innerHTML = ''; // 每次路由变化都重建，避免评论串页
  loading.value = true;
  clearFallback();

  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  const attrs: Record<string, string> = {
    'data-repo': GISCUS.repo,
    'data-repo-id': GISCUS.repoId,
    'data-category': GISCUS.category,
    'data-category-id': GISCUS.categoryId,
    'data-mapping': GISCUS.mapping,
    'data-strict': GISCUS.strict,
    'data-reactions-enabled': GISCUS.reactionsEnabled,
    'data-emit-metadata': GISCUS.emitMetadata,
    'data-input-position': GISCUS.inputPosition,
    'data-theme': giscusTheme(),
    'data-lang': GISCUS.lang,
    'data-loading': GISCUS.loading,
  };
  for (const [key, value] of Object.entries(attrs)) script.setAttribute(key, value);
  el.appendChild(script);

  observer?.disconnect();
  observer = new MutationObserver(() => {
    const frame = el.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (!frame || frame.dataset.bound === '1') return;
    frame.dataset.bound = '1';
    frame.addEventListener('load', () => {
      loading.value = false;
      clearFallback();
      syncGiscusTheme();
    });
    observer?.disconnect();
    observer = null;
  });
  observer.observe(el, { childList: true, subtree: true });

  // 兜底：脚本被拦截 / 长期未就绪时也要收起骨架屏
  fallbackTimer = window.setTimeout(() => {
    loading.value = false;
    fallbackTimer = null;
  }, 10000);
}

onMounted(() => {
  initTheme();
  stopThemeWatch = onThemeChange(syncGiscusTheme);

  const host = container.value;
  if (!host || typeof IntersectionObserver === 'undefined') {
    void nextTick(mountGiscus);
    return;
  }
  visibilityObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      visibilityObserver?.disconnect();
      visibilityObserver = null;
      void nextTick(mountGiscus);
    },
    { rootMargin: '400px 0px' },
  );
  visibilityObserver.observe(host);
});

watch(
  () => route.fullPath,
  () => {
    if (visibilityObserver) return;
    void nextTick(mountGiscus);
  },
);

onBeforeUnmount(() => {
  observer?.disconnect();
  visibilityObserver?.disconnect();
  visibilityObserver = null;
  clearFallback();
  stopThemeWatch?.();
  if (container.value) container.value.innerHTML = '';
});
</script>

<template>
  <div class="giscus-host">
    <div v-if="loading" class="giscus-skeleton" aria-hidden="true">
      <div class="giscus-skeleton__bar" style="width: 30%" />
      <div class="giscus-skeleton__bar" style="width: 100%" />
      <div class="giscus-skeleton__bar" style="width: 70%" />
    </div>
    <div ref="container" class="post-comments" />
  </div>
</template>

<style scoped lang="scss">
.giscus-host {
  margin-top: 32px;
}
.giscus-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
}
.giscus-skeleton__bar {
  height: 12px;
  background: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 6px;
  animation: skeleton-pulse 1.4s ease-in-out infinite;
}
@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .giscus-skeleton__bar {
    animation: none;
  }
}
</style>
