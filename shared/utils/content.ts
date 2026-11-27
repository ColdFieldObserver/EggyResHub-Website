// ============================================================
// 内容共用工具：@nuxt/content 查询结果 → 前端统一使用的轻量结构
// ============================================================
import { formatDisplayDate } from './date';
import type { Resource } from '../types/resource';

const DEFAULT_COVER = '/images/default-cover.webp';

/** content 文档里本文件用到的字段（避免依赖生成类型的细节） */
export interface ContentDoc {
  path: string;
  title?: string | null;
  date?: string | null;
  description?: string | null;
  cover?: string | null;
  categories?: string[] | null;
  tags?: string[] | null;
  stickypost?: boolean | null;
  body?: unknown;
}

export function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item) => item !== null && item !== undefined).map(String);
  }
  if (value === null || value === undefined || value === '') return [];
  return [String(value)];
}

/**
 * 原始条目 → 轻量 Resource（不含正文，供列表 / 卡片 / 侧栏使用）。
 *
 * 内容文件按 content/<folder>/<slug>.md 存放：文件夹是第一层（分区），
 * 对外详情页仍是扁平路径 /resources/<slug>。
 */
export function toResource(doc: ContentDoc): Resource {
  // path 形如 /resources/<folder>/<slug>，前缀由 content.config 的 prefix 注入
  const segments = doc.path.split('/').filter(Boolean);
  const slug = segments.at(-1) ?? '';
  const folder = segments.length > 2 ? (segments[1] ?? '') : '';
  return {
    path: `/resources/${slug}`,
    title: doc.title ?? '',
    folder,
    date: String(doc.date ?? ''),
    displayDate: formatDisplayDate(doc.date),
    categories: toArray(doc.categories),
    tags: toArray(doc.tags),
    description: doc.description ?? '',
    stickypost: doc.stickypost === true,
    cover: doc.cover && doc.cover.trim() ? doc.cover : DEFAULT_COVER,
  };
}

/** MDC AST → 纯文本（本地检索语料用，块级元素之间补空格避免词粘连） */
interface MdcNode {
  type?: string;
  tag?: string;
  value?: string;
  children?: MdcNode[];
}

export function mdcToText(node: MdcNode | null | undefined): string {
  if (!node) return '';
  if (node.type === 'text') return node.value ?? '';
  const inner = (node.children ?? []).map((child) => mdcToText(child)).join('');
  return node.tag ? `${inner} ` : inner;
}

/** 按日期字符串倒序 */
export function byDateDesc(a: Resource, b: Resource): number {
  return b.date.localeCompare(a.date);
}
