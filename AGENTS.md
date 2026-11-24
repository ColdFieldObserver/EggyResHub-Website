# AGENTS.md

> 本文件仅适用于 **EggyResHub-Website（蛋仔资源站）** 仓库，请勿套用到其他项目。

## 项目概况

| 项       | 值                                                                                            |
| -------- | --------------------------------------------------------------------------------------------- |
| 定位     | 蛋仔相关资源的集中展示与检索站点，纯静态（SSG），assets-only Worker 部署于 Cloudflare Workers |
| 计划地址 | https://eggyreshub.skystarlight.top                                                           |
| 技术栈   | Nuxt 4.6.4（SSG）+ @nuxt/content + Vuetify 4.3.4 + TypeScript 6.0.2 + Sass                    |
| 包管理   | pnpm（`packageManager` 锁定），CI 用 `pnpm install --frozen-lockfile`                         |
| 发布流程 | Cloudflare Workers Builds 连接 Git 仓库，main 推送自动构建部署；CI 只校验不部署               |
| 许可证   | AGPL-3.0（见 LICENSE）                                                                        |

## 常用命令

```bash
pnpm dev                 # 本地开发
pnpm build               # 生产构建 = nuxi generate + sitemap + 字体灌注 + 产物校验
pnpm generate            # 仅 nuxi generate
pnpm preview             # wrangler dev：按 Cloudflare 规则验收产物
pnpm exec nuxi prepare   # 生成 .nuxt 类型与别名（改 nuxt.config 后手动跑一次）
pnpm lint                # oxlint
pnpm typecheck           # tsc --noEmit -p tsconfig.check.json
pnpm format              # prettier 全量重排
pnpm format:check        # 只检查不写入（CI 用）
```

- 构建必须零错误。`nitro.prerender.failOnError: true`，任何路由 404 都会让构建失败。
- `verify-output.mjs` 会逐条对账 `buildRoutes()` 是否都有产物，抓「该枚举却漏了」的页面。

## 硬性规则

### 样式

- **优先用 Vuetify 组件与工具类**，只有需要特殊处理的部分才手写 SCSS（`app/assets/styles/`，全局包进 `@layer components`）。
- 手写 CSS **不要加入大位移、旋转等夸张效果**；hover 只用颜色 / 阴影 / 发光，新增动效补 `prefers-reduced-motion` 分支。
- **颜色走 Vuetify 运行时主题变量** `rgb(var(--v-theme-*))`，深色只写 `.dark` 一条；**尺寸 / 字体 / 圆角等静态令牌走 Sass 变量**（`app/assets/styles/_vars.scss`，由 `additionalData` 注入每个 scss 文件）。不要用 Sass 变量控制运行时深色状态。
- Vuetify Sass 变量入口是 `app/assets/styles/settings.scss`（`@use 'vuetify/settings' with (...)`），由 `vuetify-nuxt-module` 的 `styles.configFile` 注入；该文件只放静态令牌，不含运行时颜色。
- `_vars.scss` 只含纯变量定义，不含任何 `@use` / 规则——否则会破坏 Vuetify settings 的 `@use` 顺序约束。

### 代码风格

- **语句一律带分号**（Prettier `semi: true`），不采用无分号风格。
- 排版交 Prettier，oxlint 只管「可能出错的地方」；职责重叠规则由 `.oxlintrc.json` 关掉。
- `content/` 与 `public/` 不进 Prettier（MDC / 公式 / 中文长句经不起换行重排）。
- TypeScript 是别名安装的（`@typescript/typescript6`）：lint 工具链暂不兼容 TS 7，**升级 TS 7 前先确认 lint 工具已支持**。
- 注释风格：中文、`// ====` 分节横幅，只解释「为什么」，不复述代码。

### 路由与内容

- **新增页面必须同步 `build/content-index.ts` 的 `buildRoutes()`**，`crawlLinks: false` 下没登记的页线上就是 404。
- 中文分类 / 标签名传给 `prerender:routes` 用**原始 UTF-8**，不要预先编码；拼链接时才 `encodeURIComponent`。
- 站内链接一律 `<NuxtLink :to>`，严禁裸 `<a href>` 指向站内路由；站外链接 `target="_blank" rel="noopener noreferrer"`（正文由 `rehype-external-links.ts` 构建期处理）。
- 内容 frontmatter：`title / date / categories / tags / description / stickypost / cover`；字段类型在 `content.config.ts` 用 zod 声明，**新增字段先改 schema**。
- `date` 按字符串接收，须经 `shared/utils/date.ts` 的 UTC 解析，避免构建机时区漂移。
- 资源按分区存放 `content/<section>/*.md`，分区元信息在 `content/<section>/.categorynav.yml`（`title / description / order`）。
- 数据链路：`server/routes/api/*.json.ts` 在构建期生成静态 JSON，前端 composable 读取；**不要在组件里直接 `queryCollection`**（预渲染阶段拿不到请求上下文）。文件命名用 `<dir>/index.json.ts`，不要 `[slug].json.ts`。

### 字体与图标

- 字体自包含、构建期灌注、仓库零字体文件、不走 CDN：HarmonyOS Sans SC 由 `sync-fonts.mjs` 在 generate 之后注入 `.output/public/fonts/`；Cascadia Code 走 `@fontsource/cascadia-code` 由 Vite 打包。
- 图标只用 `@iconify-json/mdi` + `@iconify-json/simple-icons`，`@nuxt/icon` 构建期内联 SVG。**动态 `:name` 绑定的图标必须登记进 `nuxt.config.ts` 的 `icon.clientBundle.icons`**，否则静态站运行时会去 Iconify API 取图。

### 主题

- 三态主题由 `app/composables/useSiteTheme.ts` 独占（写 `<html data-theme>` + `.dark` / `.light`），首帧防闪由 `nuxt.config.ts` 的 critical 内联脚本负责，storage key 是 `THEME_STORAGE_KEY`，两处必须一致。
- 布局里用 `useTheme()`（Vuetify）把 `resolvedDark` 同步到 `vTheme.global.name`，让组件颜色跟着切。

### Giscus

- 配置在 `shared/site.ts` 的 `GISCUS`；皮肤 `public/giscus/{light,dark}.css` 由 `public/_headers` 补 ACAO（Workers 默认不带 CORS，缺了评论主题失效）。
- 组件懒加载 + SPA 路由重建 + postMessage 换肤，改动时保持这三个机制。

### 目录结构

```
app/                       # 页面 / 布局 / 组件 / composables / data / assets
├─ app.vue                 # NuxtLayout + NuxtPage
├─ layouts/default.vue     # VApp 外壳：顶栏 + 宽侧栏 + 主内容 + 全局对话框
├─ pages/                  # 首页 / 资源 / 分类 / 标签 / 分区 / 友链 / 社区 / 搜索 / 详情
├─ components/             # 卡片 / 轮播 / 对话框 / Giscus 等
│  └─ content/             # Prose 覆盖：ProsePre / ProseTable / ProseH2/H3 / ProseUl/Ol/Li
├─ composables/            # useSiteTheme / useResources / useSearch / useSidebar
├─ data/                   # nav / home / links / communities / about
└─ assets/styles/          # settings.scss / _vars.scss / main / prose / animation
content/<section>/         # 资源文档 + .categorynav.yml
shared/                    # site.ts（SITE / PAGE_SIZE / GISCUS）、types、utils
build/                     # content-index.ts（路由枚举）、rehype-external-links.ts
server/routes/api/         # 构建期静态 JSON
scripts/                   # generate-sitemap / sync-fonts / verify-output
public/                    # images / giscus 皮肤 / _headers
```

不要提交 `.nuxt/`、`.output/`、`.data/`、`.wrangler/`、`dist/`、`public/fonts/`、`node_modules/`（已在 `.gitignore`）。

## CI

- `.github/workflows/check.yml`：`nuxi prepare` → `oxlint` → `tsc` → `build`。
- `.github/workflows/prettier.yml`：`prettier --check`。两者独立、同时进行，格式检查不阻塞检查流程。
- 部署不在 CI 里 `wrangler deploy`，由 Cloudflare Workers Builds 处理。
