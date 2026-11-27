# 蛋仔资源站（EggyResHub）

一站式获取蛋仔相关资源的静态站点。详细设计与演进见 [`PLAN.md`](./PLAN.md)，协作约定见 [`AGENTS.md`](./AGENTS.md)。

## 技术栈

| 项       | 选型                                                               |
| -------- | ------------------------------------------------------------------ |
| 框架     | Nuxt 4.6.4（SSG 静态生成）                                         |
| 内容层   | @nuxt/content                                                      |
| 样式库   | Vuetify 4.3.4                                                      |
| 语言     | TypeScript 6.0.2                                                   |
| 预处理器 | Sass（接入 Vuetify Sass 变量机制）                                 |
| 图标     | @nuxt/icon（Material Design Icons + Simple Icons，构建期内联 SVG） |
| SQLite   | Node 内置 `node:sqlite`（不用 `better-sqlite3`）                   |
| 包管理   | pnpm                                                               |

## 本地开发

要求 Node ≥ 22.12（`node:sqlite` 是 Node 22.5+ 的实验特性）。

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

## 构建与预览

```bash
pnpm build          # nuxi generate + 生成 sitemap + 字体灌注 + 产物校验
pnpm preview        # wrangler dev，按 Cloudflare 规则验收同一份产物
```

`pnpm build` 实际是四步串联：`nuxi generate` → `generate-sitemap.mjs` → `sync-fonts.mjs` → `verify-output.mjs`。产物在 `.output/public`，`verify-output.mjs` 会逐条对账预渲染路由是否齐全。

## 内容编写

资源文档按 `content/<folder>/<slug>.md` 存放：文件夹是分类页第一层，分类页统一为 文件夹 → 分类 → 文章 三层（`/categories/` → `/categories/<folder>` → `/categories/<folder>/<category>/`）。分类来自 frontmatter 的 `categories`（标签来自 `tags`），详情页统一为 `/resources/<slug>`。frontmatter：

```yaml
---
title: 资源标题
date: 2026-11-20 09:30:00
categories: [分类]
tags: [标签]
description: 资源描述
stickypost: false
cover: /images/xxx.webp # 可选，缺省退化为 public/images/default-cover.webp
---
```

**新增页面或资源后**：`build/content-index.ts` 会在构建期自动扫描并登记预渲染路由，无需手动改路由表；但新增「页面类型」时要同步 `buildRoutes()`。

## 部署

站点以 assets-only Worker 部署在 Cloudflare Workers（Workers 名称 `eggyreshub-website`）。在 Cloudflare 侧把 Git 仓库连上 Workers 后，每次推送自动触发构建部署：

- build command：`pnpm build`
- deploy command：`npx wrangler deploy`

CI（`.github/workflows/`）只做校验：`check.yml`（oxlint + tsc + build）与 `prettier.yml`（格式检查）两个独立流程同时进行，格式检查不阻塞检查流程。

## 字体与图标

- 字体全部自包含：HarmonyOS Sans SC（400/500/600/700 四字重）由 `sync-fonts.mjs` 构建期灌注，Cascadia Code 由 `@fontsource` 打包；仓库不保留字体文件，也不走 CDN。
- 图标用本地 `@iconify-json` 集合构建期内联 SVG；动态绑定的图标需登记进 `nuxt.config.ts` 的 `icon.clientBundle.icons`。

## 许可证

AGPL-3.0，见 [LICENSE](./LICENSE)。站内资源与宣传图版权归各自作者所有，仅作个人学习与非商业展示使用。
