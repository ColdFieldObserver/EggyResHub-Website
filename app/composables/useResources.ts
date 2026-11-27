import { computed, type ComputedRef, type Ref } from 'vue';
import { PAGE_SIZE } from '#shared/site';
import { toArray } from '#shared/utils/content';
import type { Resource } from '#shared/types/resource';
import { folderDescription, folderIcon, folderLabel } from '~/data/folders';

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

/** 拉取并规范化全部资源。重复调用直接复用已填充状态。 */
export async function fetchResources(): Promise<void> {
  const resources = useAllResources();

  // 刻意不用 useAsyncData：数据写进 useState 后本来就随 payload 序列化，
  // 再套一层 asyncData 只会在 layout 里制造额外的 hydration 等待。
  // SSR 阶段必须用 useRequestFetch 才能发相对地址。
  const fetcher = import.meta.server ? useRequestFetch() : $fetch;
  const list = await fetcher<Resource[]>('/api/catalog.json');
  resources.value = list ?? [];
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

/** 按分类 / 标签名过滤。 */
export function filterByTerm(
  posts: Resource[],
  kind: 'categories' | 'tags',
  name: string,
): Resource[] {
  return posts.filter((post) =>
    toArray(kind === 'categories' ? post.categories : post.tags).includes(name),
  );
}

/** 分类页首层：按文件夹（content/<folder>/）聚合资源数与分类数，按资源数倒序。 */
export interface FolderItem {
  folder: string;
  label: string;
  icon: string;
  description: string;
  count: number;
  categoryCount: number;
  path: string;
}

export function listFolders(posts: Resource[]): FolderItem[] {
  const map = new Map<string, { count: number; cats: Set<string> }>();
  for (const post of posts) {
    if (!post.folder) continue;
    let entry = map.get(post.folder);
    if (!entry) {
      entry = { count: 0, cats: new Set<string>() };
      map.set(post.folder, entry);
    }
    entry.count += 1;
    for (const name of post.categories) entry.cats.add(name);
  }
  return [...map.entries()]
    .map(([folder, { count, cats }]) => ({
      folder,
      label: folderLabel(folder),
      icon: folderIcon(folder),
      description: folderDescription(folder),
      count,
      categoryCount: cats.size,
      path: `/categories/${folder}`,
    }))
    .sort((a, b) => b.count - a.count || a.folder.localeCompare(b.folder));
}

/** 分类页第二层：某个文件夹下的分类集合（按资源数倒序）。 */
export function collectTermsInFolder(posts: Resource[], folder: string): TermItem[] {
  const counter = new Map<string, number>();
  for (const post of posts) {
    if (post.folder !== folder) continue;
    for (const name of post.categories) {
      counter.set(name, (counter.get(name) ?? 0) + 1);
    }
  }
  return [...counter.entries()]
    .map(([name, count]) => ({
      name,
      count,
      path: `/categories/${folder}/${encodeURIComponent(name)}`,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** 分类页第三层：文件夹 + 分类双重过滤。 */
export function filterByFolderCategory(
  posts: Resource[],
  folder: string,
  category: string,
): Resource[] {
  return posts.filter(
    (post) => post.folder === folder && toArray(post.categories).includes(category),
  );
}

/** 分类详情页（三层）：文件夹 + 分类。 */
export function useCategoryView(folder: () => string, category: () => string) {
  const all = useAllResources();

  const title = computed(() => `${folderLabel(folder())} · ${category()}`);
  const summary = computed(() => '该分类下的资源');
  const source = () => pinnedFirst(filterByFolderCategory(all.value, folder(), category()));

  return { title, summary, source };
}
