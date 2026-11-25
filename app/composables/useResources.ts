import { computed, type ComputedRef, type Ref } from 'vue';
import { PAGE_SIZE } from '#shared/site';
import { toArray } from '#shared/utils/content';
import type { Resource, SectionNav } from '#shared/types/resource';

// ============================================================
// 资源数据访问
//
// 约定（重要）：带 useState() 的函数只能在 setup 顶层的同步代码里调用，
// 不要放进 computed / 模板 / 事件回调。取状态与算派生数据要拆开。
// 数据来自构建期预渲染的静态 JSON（/api/catalog.json 等），
// 组件里不直接调 queryCollection —— 预渲染阶段拿不到请求上下文。
// ============================================================

/** 全站共用的资源列表状态（由 layout 渲染前 fetchResources() 填一次）。 */
export function useAllResources(): Ref<Resource[]> {
  return useState<Resource[]>('resources:all', () => []);
}

/** 全站共用的分区信息状态。 */
export function useSections(): Ref<SectionNav[]> {
  return useState<SectionNav[]>('resources:sections', () => []);
}

/** 拉取并规范化全部资源与分区信息。重复调用直接复用已填充状态。 */
export async function fetchResources(): Promise<void> {
  const resources = useAllResources();
  const sections = useSections();

  // 刻意不用 useAsyncData：数据写进 useState 后本来就随 payload 序列化，
  // 再套一层 asyncData 只会在 layout 里制造额外的 hydration 等待。
  // SSR 阶段必须用 useRequestFetch 才能发相对地址。
  const fetcher = import.meta.server ? useRequestFetch() : $fetch;
  const [list, nav] = await Promise.all([
    fetcher<Resource[]>('/api/catalog.json'),
    fetcher<SectionNav[]>('/api/sections.json'),
  ]);
  resources.value = list ?? [];
  sections.value = nav ?? [];
}

/** 置顶优先排序：stickypost 为 true 的资源整体前移（稳定排序）。 */
export function pinnedFirst(posts: Resource[]): Resource[] {
  return [...posts].sort((a, b) => Number(b.stickypost) - Number(a.stickypost));
}

export interface PagedResources {
  totalPages: ComputedRef<number>;
  page: ComputedRef<number>;
  pageResources: ComputedRef<Resource[]>;
}

/** 列表分页组合式函数。 */
export function usePagedResources(
  getCurrent: () => number,
  getSource: () => Resource[],
): PagedResources {
  const totalPages = computed(() => Math.max(1, Math.ceil(getSource().length / PAGE_SIZE)));
  const page = computed(() => {
    const raw = Math.floor(Number(getCurrent()));
    if (!Number.isFinite(raw) || raw < 1) return 1;
    return Math.min(raw, totalPages.value);
  });
  const pageResources = computed(() =>
    getSource().slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE),
  );
  return { totalPages, page, pageResources };
}

export interface TermItem {
  name: string;
  count: number;
  path: string;
}

/** 统计分类 / 标签集合（按资源数倒序）。 */
export function collectTerms(kind: 'categories' | 'tags', posts: Resource[]): TermItem[] {
  const counter = new Map<string, number>();
  for (const post of posts) {
    for (const name of kind === 'categories' ? post.categories : post.tags) {
      counter.set(name, (counter.get(name) ?? 0) + 1);
    }
  }
  return [...counter.entries()]
    .map(([name, count]) => ({
      name,
      count,
      path: `/${kind}/${encodeURIComponent(name)}`,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** 取最新 n 条资源（不受 stickypost 控制，纯按时间序）。 */
export function latestResources(posts: Resource[], n: number): Resource[] {
  return posts.slice(0, n);
}

/** 特色资源：仅 stickypost: true 的资源。 */
export function stickyResources(posts: Resource[]): Resource[] {
  return posts.filter((post) => post.stickypost);
}

/** 按分类 / 标签 / 分区名过滤。 */
export function filterByTerm(
  posts: Resource[],
  kind: 'categories' | 'tags' | 'sections',
  name: string,
): Resource[] {
  if (kind === 'sections') return posts.filter((post) => post.section === name);
  return posts.filter((post) =>
    toArray(kind === 'categories' ? post.categories : post.tags).includes(name),
  );
}

/**
 * 分类详情页的解析：分区已并入分类路由（/categories/<slug>），
 * 因此 URL 里的 name 既可能是 frontmatter 分类名，也可能是分区 slug。
 * 命中分区时按 section 过滤、标题用分区标题；否则按分类名过滤。
 */
export function useCategoryView(name: () => string) {
  const all = useAllResources();
  const sections = useSections();

  const section = computed(() => sections.value.find((item) => item.slug === name()));
  const title = computed(() => (section.value ? section.value.title : `分类：${name()}`));
  const summary = computed(() => (section.value ? section.value.description : '该分类下的资源'));
  const source = () =>
    pinnedFirst(
      section.value
        ? filterByTerm(all.value, 'sections', section.value.slug)
        : filterByTerm(all.value, 'categories', name()),
    );

  return { title, summary, source, section };
}
