// ============================================================
// 构建期内容索引：直接读 content/ 下的 md 与 .categorynav.yml
// ------------------------------------------------------------
// 为什么还要 fs 扫描：预渲染路由必须在构建早期就能枚举出全集，
// 而内容库（@nuxt/content）在 `prerender:routes` 阶段尚未提供同步查询接口。
// 本文件同时被 nuxt.config.ts（Vite）与 scripts/*.mjs（Node）直接 import，
// 因此内部相对导入一律带显式 .ts 扩展名（Node ESM 不补扩展名）。
// ============================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { PAGE_SIZE, LATEST_COUNT } from '../shared/site.ts';
import { formatDisplayDate, dateSortKey } from '../shared/utils/date.ts';
import type { Resource, SectionNav } from '../shared/types/resource.ts';

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

/** content/ 下的一级分区目录（英文名，排除点目录） */
export function sectionDirs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .sort();
}

/** 解析纯 YAML 的 .categorynav.yml：借 gray-matter 的 YAML 解析器读 frontmatter */
function readSectionMeta(section: string): { title: string; description: string; order: number } {
  const file = path.join(CONTENT_DIR, section, '.categorynav.yml');
  let title = section;
  let description = '';
  let order = 999;
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    // 纯 YAML 没有 --- 包裹，人工补一层 frontmatter 再交给 gray-matter
    const { data } = matter(`---\n${raw}\n---\n`);
    title = String(data.title ?? section);
    description = String(data.description ?? '');
    const parsed = Number(data.order ?? data.categoryOrder ?? 999);
    order = Number.isFinite(parsed) ? parsed : 999;
  } catch {
    // 缺 .categorynav.yml 时用文件夹名兜底，不让构建挂掉
  }
  return { title, description, order };
}

/** content/<section>/*.md 的绝对路径（不含点文件） */
function markdownFiles(): { file: string; section: string; slug: string }[] {
  const out: { file: string; section: string; slug: string }[] = [];
  for (const section of sectionDirs()) {
    const dir = path.join(CONTENT_DIR, section);
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith('.md') || name.startsWith('.')) continue;
      out.push({ file: path.join(dir, name), section, slug: name.slice(0, -3) });
    }
  }
  return out;
}

/** 全站资源列表（按日期倒序），供路由枚举与静态数据兜底 */
export function listResources(): Resource[] {
  const list = markdownFiles().map(({ file, section, slug }) => {
    const { data } = matter(fs.readFileSync(file, 'utf-8'));
    const cover = typeof data.cover === 'string' && data.cover.trim() ? data.cover : DEFAULT_COVER;
    return {
      path: `/resources/${section}/${slug}`,
      title: String(data.title ?? slug),
      date: String(data.date ?? ''),
      displayDate: formatDisplayDate(data.date),
      categories: toArray(data.categories),
      tags: toArray(data.tags),
      description: String(data.description ?? ''),
      stickypost: data.stickypost === true,
      cover,
      section,
    } satisfies Resource;
  });
  return list.sort((a, b) => dateSortKey(b.date) - dateSortKey(a.date));
}

/** 分区信息（含该分区资源数），按 order 升序 */
export function listSections(): SectionNav[] {
  const counts = new Map<string, number>();
  for (const resource of listResources()) {
    counts.set(resource.section, (counts.get(resource.section) ?? 0) + 1);
  }
  return sectionDirs()
    .map((slug) => ({ slug, ...readSectionMeta(slug), count: counts.get(slug) ?? 0 }))
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
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
    '/api/sections.json',
    '/api/search.json',
  ];

  // 全部资源分页（第 1 页就是 /resources/）
  for (let page = 2; page <= totalPagesOf(resources.length); page += 1) {
    routes.push(`/resources/page/${page}`);
  }

  // 资源详情页 + 对应的单篇正文静态 JSON
  for (const resource of resources) {
    routes.push(resource.path);
    routes.push(`/api/resources${resource.path.replace(/^\/resources/, '')}/index.json`);
  }

  // 分区已并入分类体系：分区 slug 走 /categories/<slug>（与中文分类名共存）
  for (const section of listSections()) {
    const base = `/categories/${section.slug}`;
    routes.push(base);
    for (let page = 2; page <= totalPagesOf(section.count); page += 1) {
      routes.push(`${base}/page/${page}`);
    }
  }

  // 分类 / 标签页（含各自分页）
  for (const field of ['categories', 'tags'] as const) {
    for (const [name, count] of countByField(field)) {
      const base = `/${field}/${termSlug(name)}`;
      routes.push(base);
      for (let page = 2; page <= totalPagesOf(count); page += 1) {
        routes.push(`${base}/page/${page}`);
      }
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
