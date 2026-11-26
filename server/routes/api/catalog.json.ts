import { defineEventHandler } from 'nuxt/server';
import { queryCollection } from '@nuxt/content/server';
import { toResource, byDateDesc } from '#shared/utils/content';

// 轻量资源列表（不含正文）：全部资源页、首页、分类/标签页、侧栏共用。
// 该路由会被预渲染成静态文件，客户端导航直接复用，不依赖内容库运行时。
export default defineEventHandler(async (event) => {
  const docs = await queryCollection(event, 'resources').all();
  return docs.map((doc) => toResource(doc as never)).sort(byDateDesc);
});
