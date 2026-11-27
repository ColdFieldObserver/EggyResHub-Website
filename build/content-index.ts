// ============================================================
// 构建期内容索引：直接读 content/ 下的 md
// ------------------------------------------------------------
// 为什么还要 fs 扫描：预渲染路由必须在构建早期就能枚举出全集，
// 而内容库（@nuxt/content）在 `prerender:routes` 阶段尚未提供同步查询接口。
// 本文件同时被 nuxt.config.ts（Vite）与 scripts/*.mjs（Node）直接 import，
// 因此内部相对导入一律带显式 .ts 扩展名（Node ESM 不补扩展名）。
//
// 内容组织：按 content/<folder>/<slug>.md 存放；文件夹是分类页第一层（分区），
// 分类页统一为 文件夹 → 分类 → 文章 三层；分类/标签来自 frontmatter，
// 对外详情页统一为 /resources/<slug>。
// ============================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { PAGE_SIZE, LATEST_COUNT } from '../shared/site.ts';
import { formatDisplayDate, dateSortKey } from '../shared/utils/date.ts';
import type { Resource } from '../shared/types/resource.ts';

export { PAGE_SIZE, LATEST_COUNT };

/** content/ 的绝对路径（本文件位于 build/ 下） */
export const CONTENT_DIR = fileURLToPath(new URL('../content', import.meta.url));

const DEFAULT_COVER = '/images/default-cover.webp';

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item) => item !== null && item !== undefined).map(String);
  }
  if (value === null || value === undefined || value === '') return [];
  return [String(value)];
}

/** content/ 下递归找到的所有 Markdown 文件（忽略点目录 / 点文件） */
function markdownFiles(): { file: string; slug: string }[] {
  const out: { file: string; slug: string }[] = [];
  function walk(dir: string): void {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.md')) out.push({ file: full, slug: entry.name.slice(0, -3) });
    }
  }
  walk(CONTENT_DIR);
  return out;
}

/** 全站资源列表（按日期倒序），供路由枚举与静态数据兜底 */
export function listResources(): Resource[] {
  const list = markdownFiles().map(({ file, slug }) => {
    const { data } = matter(fs.readFileSync(file, 'utf-8'));
    const cover = typeof data.cover === 'string' && data.cover.trim() ? data.cover : DEFAULT_COVER;
    // content/<folder>/<slug>.md → folder 取相对 CONTENT_DIR 的第一段
    const relParts = path.relative(CONTENT_DIR, file).split(path.sep);
    const folder = relParts.length > 1 ? (relParts[0] ?? '') : '';
    return {
      path: `/resources/${slug}`,
      title: String(data.title ?? slug),
      folder,
      date: String(data.date ?? ''),
      displayDate: formatDisplayDate(data.date),
      categories: toArray(data.categories),
      tags: toArray(data.tags),
      description: String(data.description ?? ''),
      stickypost: data.stickypost === true,
      cover,
    } satisfies Resource;
  });
  return list.sort((a, b) => dateSortKey(b.date) - dateSortKey(a.date));
}

/** 统计分类 / 标签下各名称的资源数 */
export function countByField(field: 'categories' | 'tags'): Map<string, number> {
  const counts = new Map<string, number>();
  for (const resource of listResources()) {
    for (const name of resource[field]) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return counts;
}

/** 列表分页页数（至少 1 页） */
export function totalPagesOf(count: number): number {
  return Math.max(1, Math.ceil(count / PAGE_SIZE));
}

/** URL 友好：中文分类 / 标签名用原始 UTF-8（不预先编码），空格等做最小处理 */
function termSlug(name: string): string {
  return name.trim();
}

/**
 * 全站可静态化的路由全集。
 * 中文 term 一律传原始 UTF-8（不能预先 encodeURIComponent），
 * 否则 Nitro 会把产物文件名写成 /%E5%85%AC... 的形式。
 */
export function buildRoutes(): string[] {
  const resources = listResources();
  const routes = [
    '/',
    '/resources/',
    '/categories/',
    '/tags/',
    '/links',
    '/community',
    '/search/',
    '/404.html',
    '/api/catalog.json',
    '/api/search.json',
  ];

  // 全部资源分页（第 1 页就是 /resources/）
  for (let page = 2; page <= totalPagesOf(resources.length); page += 1) {
    routes.push(`/resources/page/${page}`);
  }

  // 资源详情页 + 对应的单篇正文静态 JSON
  for (const resource of resources) {
    routes.push(resource.path);
    routes.push(`/api${resource.path}/index.json`);
  }

  // 分类三层：文件夹 → 分类 → 文章（含分类分页）
  const folderCats = new Map<string, Map<string, number>>();
  for (const resource of resources) {
    if (!resource.folder) continue;
    let cats = folderCats.get(resource.folder);
    if (!cats) {
      cats = new Map<string, number>();
      folderCats.set(resource.folder, cats);
    }
    for (const name of resource.categories) {
      cats.set(name, (cats.get(name) ?? 0) + 1);
    }
  }
  for (const [folder, cats] of folderCats) {
    routes.push(`/categories/${folder}`);
    for (const [name, count] of cats) {
      const base = `/categories/${folder}/${termSlug(name)}`;
      routes.push(base);
      for (let page = 2; page <= totalPagesOf(count); page += 1) {
        routes.push(`${base}/page/${page}`);
      }
    }
  }

  // 标签页（含各自分页）
  for (const [name, count] of countByField('tags')) {
    const base = `/tags/${termSlug(name)}`;
    routes.push(base);
    for (let page = 2; page <= totalPagesOf(count); page += 1) {
      routes.push(`${base}/page/${page}`);
    }
  }

  return [...new Set(routes)];
}

/** 可被搜索引擎收录的站点页面，不包含搜索、错误页、接口与订阅源。 */
export function buildSitemapRoutes(): string[] {
  return buildRoutes().filter(
    (route) =>
      route !== '/search/' &&
      route !== '/404.html' &&
      !route.startsWith('/api/') &&
      !/\.(xml|json)$/.test(route),
  );
}
