import { createError, defineEventHandler, getRouterParam } from 'nuxt/server';
import { queryCollection } from '@nuxt/content/server';

// 单篇资源（含 body AST）：详情页用，客户端按需拉取。
// 路径刻意以 /index.json 结尾：预渲染后落成真正的 .json 文件，
// 静态托管给 application/json，客户端 $fetch 才能直接解析。
// 内容文件在 content/ 下可任意层级存放（文件夹只是存放方式，不是分区），
// 因此按 path 的最后一段（slug）精确匹配，对外详情页统一 /resources/<slug>。
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug', { decode: true }) ?? '';

  const docs = await queryCollection(event, 'resources').all();
  const doc = docs.find((item) => item.path.split('/').filter(Boolean).at(-1) === slug);

  if (!doc) {
    throw createError({ status: 404, message: '资源不存在', fatal: true });
  }

  return doc;
});
