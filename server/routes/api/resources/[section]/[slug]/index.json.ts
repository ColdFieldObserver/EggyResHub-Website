import { queryCollection } from '@nuxt/content/server';

// 单篇资源（含 body AST）：详情页用，客户端按需拉取。
// 路径刻意以 /index.json 结尾：预渲染后落成真正的 .json 文件，
// 静态托管给 application/json，客户端 $fetch 才能直接解析。
// 用 all() + 精确比对而不是 .path()：内容量小，直接比对最稳。
export default defineEventHandler(async (event) => {
  const section = getRouterParam(event, 'section') ?? '';
  const slug = getRouterParam(event, 'slug') ?? '';
  const target = `/resources/${section}/${slug}`;

  const docs = await queryCollection(event, 'resources').all();
  const doc = docs.find((item) => item.path === target);

  if (!doc) {
    throw createError({ statusCode: 404, message: '资源不存在', fatal: true });
  }

  return doc;
});
