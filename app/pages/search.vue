<script setup lang="ts">
// 搜索页：搜索对话框的直达 / 无 JS 降级入口，与对话框共用关键词状态。
import {
  searchKeyword,
  syncKeywordFromUrl,
  writeKeywordToUrl,
  loadCorpus,
  matchDocs,
  type SearchDoc,
} from '~/composables/useSearch';

const corpus = ref<SearchDoc[]>([]);
const status = ref<'loading' | 'ready' | 'error'>('loading');
const mounted = ref(false);

onMounted(async () => {
  mounted.value = true;
  syncKeywordFromUrl();
  try {
    corpus.value = await loadCorpus();
    status.value = 'ready';
  } catch {
    status.value = 'error';
  }
});

const hits = computed(() => matchDocs(corpus.value, searchKeyword.value));

function onInput(event: Event) {
  searchKeyword.value = (event.target as HTMLInputElement).value;
  writeKeywordToUrl();
}

useSeoMeta({ title: '搜索资源' });
</script>

<template>
  <div class="page-shell">
    <header class="reveal-item">
      <h1 class="text-h4 font-weight-bold mb-4">搜索资源</h1>
      <form role="search" @submit.prevent>
        <input
          v-if="mounted"
          :value="searchKeyword"
          type="search"
          name="q"
          placeholder="搜索资源标题、描述、标签与正文…"
          aria-label="搜索资源"
          autocomplete="off"
          class="search-input"
          @input="onInput"
        />
        <p v-else class="muted-text text-body-2">本站搜索需要启用 JavaScript。</p>
      </form>
      <p class="muted-text text-body-2 mt-3" aria-live="polite">
        <template v-if="status === 'loading'">正在加载检索语料…</template>
        <template v-else-if="status === 'error'">检索语料加载失败，请刷新重试。</template>
        <template v-else-if="!searchKeyword.trim()">输入关键词开始搜索资源。</template>
        <template v-else>找到 {{ hits.length }} 条结果</template>
      </p>
    </header>

    <div v-if="hits.length" class="card-grid mt-6 reveal-item">
      <ResourceCard v-for="doc in hits" :key="doc.path" :resource="doc" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-input {
  width: 100%;
  max-width: 640px;
  padding: 12px 18px;
  font-family: $font-ui;
  font-size: 15px;
  // color-scheme 由 <html> 的 .v-theme--* 类统一控制（Vuetify 4 自带），不重复内联
  color: rgb(var(--v-theme-on-surface));
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-on-surface) / 0.18);
  border-radius: 999px;
  outline: none;
  &:focus {
    border-color: rgb(var(--v-theme-primary));
  }
}
</style>
