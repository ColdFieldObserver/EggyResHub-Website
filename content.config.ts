import { defineCollection, defineContentConfig, z } from '@nuxt/content';

// ============================================================
// 内容集合：资源文档
//   - 源文件在 content/<section>/*.md，路径形如 content/category/source.md
//   - source 加 prefix '/resources'：文档的 path 即详情页路由
//     /resources/<section>/<slug>
//   - 分类 / 标签是 frontmatter 字段，由前端过滤生成列表页
//   - 分区元信息在 content/<section>/.categorynav.yml，由构建期脚本读取
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
