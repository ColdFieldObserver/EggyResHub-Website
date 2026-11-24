/**
 * 日期工具：YAML 1.2 不会把 `2026-10-20 22:00:00` 解析成 Date，
 * 统一按字符串接收，再由此显式按 UTC 解释，避免构建机时区导致日期 / 年份漂移。
 */

/** 把 frontmatter 的日期字符串按 UTC 解析成 Date；无法解析时返回 null。 */
export function parsePostDate(value: unknown): Date | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  // `YYYY-MM-DD HH:mm:ss` → `YYYY-MM-DDTHH:mm:ssZ`（按 UTC）
  const normalized = raw.replace(' ', 'T');
  const withZone = /[Zz]|[+-]\d{2}:?\d{2}$/.test(normalized) ? normalized : `${normalized}Z`;
  const date = new Date(withZone);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** 展示用日期：YYYY-MM-DD（按 UTC，不随本地时区变化）。 */
export function formatDisplayDate(value: unknown): string {
  const date = parsePostDate(value);
  if (!date) return '';
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 排序用时间戳（倒序）；无法解析的排到最后。 */
export function dateSortKey(value: unknown): number {
  const date = parsePostDate(value);
  return date ? date.getTime() : 0;
}
