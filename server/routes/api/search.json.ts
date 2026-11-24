import { queryCollection } from '@nuxt/content/server';
import { toResource, toArray, mdcToText, byDateDesc } from '#shared/utils/content';

// 本地检索语料：构建期查询全部资源 → 纯文本正文（截断 3000 字）。
// 预渲染成 /api/search.json，客户端只在打开搜索对话框时按需拉取一次。
const CONTENT_LIMIT = 3000;

export default defineEventHandler(async (event) => {
  const docs = await queryCollection(event, 'resources').all();
  return docs
    .map((doc) => {
      const item = doc as { path?: string; title?: string; body?: unknown; tags?: string[] };
      return {
        ...toResource(doc as never),
        content: mdcToText(item.body as never)
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, CONTENT_LIMIT),
        searchTags: toArray(item.tags),
      };
    })
    .sort(byDateDesc);
});
