<script setup lang="ts">
// 搜索对话框：Vuetify VDialog 承载焦点陷阱 / ESC / 遮罩 / 滚动锁。
// 业务侧只做「关闭后清空关键词 + 焦点归还」与结果检索展示。
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import {
  searchKeyword,
  searchDialogOpen,
  closeSearchDialog,
  clearSearchKeyword,
  restoreSearchDialogFocus,
  loadCorpus,
  matchDocs,
  type SearchDoc,
  writeKeywordToUrl,
  syncKeywordFromUrl,
} from '~/composables/useSearch';

const inputEl = ref<HTMLInputElement | null>(null);
const corpus = shallowRef<SearchDoc[]>([]);
const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle');
const mounted = ref(false);

onMounted(async () => {
  mounted.value = true;
  syncKeywordFromUrl();
  if (status.value === 'ready') return;
  status.value = 'loading';
  try {
    corpus.value = await loadCorpus();
    status.value = 'ready';
  } catch {
    corpus.value = [];
    status.value = 'error';
  }
});

const hits = computed(() => matchDocs(corpus.value, searchKeyword.value));
const tokens = computed(() => searchKeyword.value.toLowerCase().split(/\s+/).filter(Boolean));

type ResultState = 'idle' | 'loading' | 'error' | 'empty' | 'results';
const state = computed<ResultState>(() => {
  if (!tokens.value.length) return 'idle';
  if (status.value === 'loading') return 'loading';
  if (status.value === 'error') return 'error';
  return hits.value.length ? 'results' : 'empty';
});

const stats = computed(() => {
  const keyword = searchKeyword.value.trim();
  switch (state.value) {
    case 'idle':
      return '输入关键词开始搜索资源。';
    case 'loading':
      return '正在加载检索语料…';
    case 'error':
      return '检索语料加载失败，请刷新重试。';
    case 'empty':
      return `未找到与"${keyword}"相关的资源。`;
    default:
      return `找到 ${hits.value.length} 条与"${keyword}"相关的结果`;
  }
});

function onInput(event: Event) {
  searchKeyword.value = (event.target as HTMLInputElement).value;
  writeKeywordToUrl();
}

watch(searchDialogOpen, (open) => {
  if (open) {
    // 打开时把焦点交给输入框
    requestAnimationFrame(() => inputEl.value?.focus({ preventScroll: true }));
    return;
  }
  clearSearchKeyword();
  requestAnimationFrame(restoreSearchDialogFocus);
});

// 点结果里的资源卡片 → 先收起弹窗再跳转
function onResultClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest('a[href]')) closeSearchDialog();
}
</script>

<template>
  <VDialog v-model="searchDialogOpen" max-width="960" scrollable>
    <VCard rounded="lg">
      <VCardTitle class="d-flex align-center justify-space-between pa-5 pb-2">
        <span class="text-h6">搜索资源</span>
        <VBtn variant="text" density="comfortable" aria-label="关闭搜索" @click="closeSearchDialog">
          <Icon name="mdi:close" size="20" aria-hidden="true" />
        </VBtn>
      </VCardTitle>

      <VCardText class="pt-0 px-5">
        <form role="search" class="search-field" @submit.prevent>
          <Icon name="mdi:magnify" size="20" class="search-field__icon" aria-hidden="true" />
          <input
            v-if="mounted"
            ref="inputEl"
            :value="searchKeyword"
            type="search"
            name="q"
            placeholder="搜索资源标题、描述、标签与正文…"
            aria-label="搜索资源"
            autocomplete="off"
            class="search-field__input"
            @input="onInput"
          />
          <p v-else class="muted-text text-body-2">本站搜索需要启用 JavaScript。</p>
        </form>

        <p class="muted-text text-body-2 my-3" aria-live="polite">{{ stats }}</p>

        <div class="search-results" @click="onResultClick">
          <div v-if="state === 'results'" class="card-grid">
            <ResourceCard v-for="doc in hits" :key="doc.path" :resource="doc" compact />
          </div>
          <p v-else-if="state === 'loading'" class="muted-text text-body-2">正在加载…</p>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">
.search-field {
  position: relative;
  display: flex;
  align-items: center;
}
.search-field__icon {
  position: absolute;
  left: 14px;
  opacity: 0.6;
  pointer-events: none;
}
.search-field__input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  font-family: $font-ui;
  font-size: 15px;
  // color-scheme 由 <html> 上的 .v-theme--dark/.v-theme--light 类统一控制
  // （Vuetify 4 的类自带 color-scheme），这里不重复内联声明，避免优先级打架。
  color: rgb(var(--v-theme-on-surface));
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.18);
  border-radius: 999px;
  outline: none;
  transition: border-color $transition-fast ease;

  &:focus {
    border-color: rgb(var(--v-theme-primary));
  }
}
.search-results {
  max-height: min(58vh, 640px);
  overflow-y: auto;
}
</style>
