import { ref } from 'vue';
import type { Resource } from '#shared/types/resource';

// ============================================================
// 全站共享的搜索关键词与对话框状态。
// 搜索对话框与 /search/ 页共用这份模块级状态。
// ============================================================

export interface SearchDoc extends Resource {
  content: string;
  searchTags: string[];
}

export const searchKeyword = ref('');
export const searchDialogOpen = ref(false);

let searchDialogOpener: HTMLElement | null = null;

export function openSearchDialog(opener?: HTMLElement): void {
  if (!searchDialogOpen.value && typeof document !== 'undefined') {
    searchDialogOpener =
      opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
  }
  searchDialogOpen.value = true;
}

export function closeSearchDialog(): void {
  searchDialogOpen.value = false;
}

export function clearSearchKeyword(): void {
  searchKeyword.value = '';
  writeKeywordToUrl();
}

export function restoreSearchDialogFocus(): void {
  const opener = searchDialogOpener;
  searchDialogOpener = null;
  if (opener?.isConnected) opener.focus({ preventScroll: true });
}

/** 从地址栏 ?q= 同步关键词（仅浏览器端生效；无该参数时清空）。 */
export function syncKeywordFromUrl(): void {
  if (typeof window === 'undefined') return;
  searchKeyword.value = new URLSearchParams(window.location.search).get('q') ?? '';
}

/**
 * 把关键词写回当前地址栏的 ?q= 参数，不触发路由跳转。
 * 使用 replaceState：不产生历史记录、不触发路由跳转，输入框不会失焦。
 */
export function writeKeywordToUrl(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  const q = searchKeyword.value.trim();
  if (q) url.searchParams.set('q', q);
  else url.searchParams.delete('q');
  // 保留 router 写入的 state，否则 vue-router 会报 R0121
  window.history.replaceState({ ...history.state }, '', url);
}

/** 检索语料（构建期静态 JSON），会话内只请求一次并复用。 */
let corpusRequest: Promise<SearchDoc[]> | null = null;

export function loadCorpus(): Promise<SearchDoc[]> {
  corpusRequest ||= $fetch<SearchDoc[]>('/api/search.json').catch((error) => {
    corpusRequest = null; // 失败不缓存，下次重试
    throw error;
  });
  return corpusRequest;
}

/** 关键词按空白切 token，对标题 / 正文 / 标签 / 描述做小写「与」匹配。 */
export function matchDocs(docs: SearchDoc[], keyword: string): SearchDoc[] {
  const tokens = keyword.toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  return docs.filter((doc) => {
    const haystack = [
      doc.title,
      doc.content ?? '',
      doc.description ?? '',
      doc.searchTags.join(' '),
      doc.categories.join(' '),
    ].map((text) => text.toLowerCase());
    return tokens.every((token) => haystack.some((text) => text.includes(token)));
  });
}
