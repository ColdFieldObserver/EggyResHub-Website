import { defineCollection, defineContentConfig, z } from '@nuxt/content';

// ============================================================
// 内容集合：资源文档
//   - 源文件按 content/<folder>/<slug>.md 存放：文件夹是分类页第一层（分区）
//   - source 加 prefix '/resources'：文档 path 形如 /resources/<folder>/<slug>
//   - 对外详情页统一扁平化为 /resources/<slug>（见 shared/utils/content.ts）
//   - 分类页统一为 文件夹 → 分类 → 文章 三层；分类/标签来自 frontmatter 字段
// ============================================================
export default defineContentConfig({
  collections: {
    resources: defineCollection({
      type: 'page',
      source: { include: '**/*.md', prefix: '/resources' },
      schema: z.object({
        title: z.string(),
        // YAML 1.2 不把日期解析成 Date，统一按字符串接收，由 date.ts 按 UTC 解释
        date: z.string(),
        description: z.string().default(''),
        categories: z.array(z.string()).default(() => []),
        tags: z.array(z.string()).default(() => []),
        stickypost: z.boolean().default(false),
        cover: z.string().optional(),
      }),
    }),
  },
});
