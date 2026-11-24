# 蛋仔资源站（EggyResHub）建设 Plan 草案

> 状态：草稿 v0.10，持续补充中

## 一、项目概况

- **网站名称**：蛋仔资源站
- **项目路径**：`D:\TestProject\EggyResHub-Website`（初始为空仓库，仅有 LICENSE）
- **定位**：蛋仔相关资源的集中展示与检索站点

## 二、技术栈

| 项       | 选型                                                                                        |
| -------- | ------------------------------------------------------------------------------------------- |
| 框架     | Nuxt 4.6.4（SSG 静态生成）                                                                  |
| 内容层   | @nuxt/content                                                                               |
| 样式库   | Vuetify 4.3.4                                                                               |
| 语言     | TypeScript 6.0.2                                                                            |
| 预处理器 | Sass                                                                                        |
| 图标库   | 优先使用 `@nuxt/icon`（图标集：Material Design Icons + Simple Icons，构建期本地内联为 SVG） |
| SQLite   | 使用 Node 内置的 `node:sqlite`（**不用** `better-sqlite3`）                                 |
| 包管理   | pnpm（锁定 `packageManager`，CI 用 `--frozen-lockfile`）                                    |

- **样式原则**：网站样式尽可能用 Vuetify 组件与工具类实现，只有需要特殊处理的部分才手写 CSS（Sass）；手写 CSS 的 hover 效果不要加入大位移、旋转等夸张效果
- **TypeScript 前瞻**：预留必要的类型声明，为将来迁移到 TypeScript 7 做准备
- **代码风格**：参照 PidanUI / OpenPidanUI 官网；TS/JS 代码**不要**模仿 SmartTeachNanfang、EasiAuto 的无分号风格（即保留分号）

## 三、部署

- **平台**：Cloudflare Workers（Static Assets）
- **Workers 名称**：`eggyreshub-website`
- **计划部署地址**：`https://eggyreshub.skystarlight.top`
- **发布流程（CI 通过后）**：在 Cloudflare 侧把 Git 仓库连接上 Workers，每次提交自动触发构建与部署（无需在 CI 里手动 `wrangler deploy`）
- 参考 EasiAutoWeb 的 `nitro` 配置与 `wrangler deploy` 流程

## 四、参考实现

- **技术栈 / 部署**：PidanUI 官网、OpenPidanUI 官网、EasiAuto 项目
- **默认配色**：PidanUI 官网
- **@nuxt/content 资源驱动**：PidanUI 项目实现
- **Giscus 配置与主题**：先从 PidanUI 官网整套复制占位
- **样式库**：本地无 Vuetify 先例，风格借鉴 MDUI 的 SmartTeachNanfang、StarLight-7693-Tools

## 五、版式

- **顶栏**：左端 = 菜单按钮 + 站点标题；右端 = 三态深色模式切换 + 搜索栏 + 「关于」按钮
- **左侧边栏**：承载导航；顶栏菜单按钮可全局收起；桌面端默认展开；样式模仿 StarLight-7693-Tools 的宽侧边栏（不做参考项目的移动端抽屉手势等增强 Hook，保持 Vuetify 默认行为）
- **三态主题**：跟随主题 / 浅色模式 / 深色模式（实现参考 StarLight-7693-Tools）
- **字体**：HarmonyOS Sans SC（400 / 500 / 600 / 700 四字重）+ Cascadia Code；字体全部自包含（随站点分发，不依赖外部 CDN）

### 对话框

- **搜索对话框**：点击搜索栏或按 `Ctrl+K` 呼出；在对话框内输入关键词即开始搜索资源
- **关于对话框**：点击顶栏「关于」按钮弹出；内容含网站简介、技术栈、联系方式、版权声明、开源声明

## 六、页面结构与版式

1. **首页**（自上而下三个区块）
   - **顶部区块**：小字号标题「蛋仔资源站」+ 副标题「一站式获取蛋仔相关资源」；标题下方左侧为特色资源轮播框，右侧为最新三条资源列表
     - 特色资源轮播框：展示 `stickypost: true` 的资源；左下角显示资源标题，中间显示资源封面，每隔一段时间自动切换，可通过「<」「>」按钮手动切换
     - 最新三条资源列表：不受 `stickypost` 属性控制；列表下方为「查看全部资源」按钮
   - **中间区块**：网站公告（公告内容在 `home.ts` 中定义）
   - **下部区块**：「蛋仔小技巧」列表（列表内容在 `home.ts` 中定义）
2. **全部资源页**
   - 文章以文章卡片形式展示，每张卡片含封面图、文章标题、文章发布日期、文章摘要
   - 一行最多 3 张卡片；每 24 张卡片为一页
   - @nuxt/content 驱动；含 Giscus 评论区（配置与主题先复制 PidanUI 官网占位）
   - 另设资源分类页、标签页；具体展示规则参照 PidanUI 官网
3. **友情链接页**
   - 友链以列表项展示，每项含图片图标、标题、描述
   - 一行最多 4 个友链项
   - 内容暂从 PidanUI 官网复制
4. **社区推广页**
   - 展示各类社区（数码科技、蛋仔爱好者等）
   - 展示规则与友情链接页类似（带图标、标题、描述的列表项）

### 页面细节与交互

- **页面切换**：带淡入淡出过渡效果
- **风格参照**：
  - 首页风格模仿 SmartTeachNanfang
  - 全部资源页、资源分类页、资源标签页模仿 PidanUI 官网

## 七、@nuxt/content 内容约定

- 资源文档按分区存放，路径形如 `content/category/source.md`
- 每个分区根目录内放一个 `.categorynav.yml`，存储该分区的相关信息
- 实现类似 OpenPidanUI 官网，但**文件名与分区文件夹名前不加编号**
- 引入 PidanUI / OpenPidanUI 官网使用的 `rehype-external-links` 插件：正文里的站外链接一律新开标签页
- **资源文档元数据结构**：

```yaml
---
title: # 资源标题
date: # 资源发布日期
categories: # 分类
tags: # 资源标签
description: # 资源描述
stickypost: false # 控制资源是否展示在首页的特色资源轮播框（轮播框左下角显示资源标题，中间显示资源封面，每隔一段时间自动切换，可通过"<"和">"按钮手动切换）
cover: # 资源封面URL地址（可选，如未定义则退化为默认封面图）
---
```

- **默认封面图**：素材为 `D:\TestProject\default-cover.webp`，已复制进项目静态资源目录 `public/images/default-cover.webp`（`cover` 缺省时退化为此图）

- **`.categorynav.yml` 结构**：

```yaml
title: # 分类标题
description: # 分类描述
order: # 分类编号
```

## 八、GitHub Actions（CI）

仓库内配置两个**相互独立**的 Action：

1. **检查流程**：`oxlint` + `tsc` + `build`（构建校验）
2. **格式流程**：`prettier`（格式检查）

- 两个流程分开运行、同时进行，互不依赖与阻塞；**prettier 不得阻塞** oxlint + tsc + build 的进程

### 构建期脚本

构建阶段依次执行以下脚本：

- `generate-sitemap.mjs`：生成网站地图（sitemap）
- `sync-fonts.mjs`：字体灌注（把自包含字体同步进构建产物）
- `verify-output.mjs`：验证构建输出

## 九、AI 规范

- 仓库根目录放 `AGENTS.md`，作为本项目的 AI 协作规范（约束助手的目录结构、改动边界、发布链路等约定）

## 十、技术实现细节（参考项目探查结论）

> 以下为探查 PidanUI / OpenPidanUI 官网、EasiAutoWeb、StarLight-7693-Tools、SmartTeachNanfang 后提炼的落地做法。
> 本项目用 Vuetify 替代参考项目的 Nuxt UI / MDUI（本地无 Vuetify 先例，是唯一需要自行验证的接入点），组件层按 Vuetify 写，机制层（SSG 路由枚举、静态 JSON、主题防闪、字体灌注等）沿用参考思路。参考项目用的是 Nuxt UI / Tailwind，本项目把其中的组件与工具类替换为 Vuetify 组件/工具类，其余机制保持一致。

### 10.1 工程骨架与构建

- 目录约定（Nuxt 4 `srcDir` 默认 `app/`）：`app/`（页面 / 组件 / composables / data / assets）、`content/`（资源文档）、`shared/`（站点常量与类型，前端与构建脚本共用）、`server/routes/`（构建期生成静态 JSON）、`build/`（路由枚举等仅构建期用的 TS）、`scripts/`（三个 `.mjs` 构建脚本）、`public/`（原样静态资源：图片、`giscus/` 皮肤、`_headers`）。
- `package.json` 的 `build` 串成 `nuxi generate && node scripts/generate-sitemap.mjs && node scripts/sync-fonts.mjs && node scripts/verify-output.mjs`；另有 `preview`（`wrangler dev`，按 Cloudflare 规则验收产物）、`generate`、`format:check`。
- **Node 版本要求**：`node:sqlite` 是 Node 22.5+ 的实验特性，参考项目要求 `node >= 22.12`（CI 用 `node-version: latest`）。本地与 CI 都须满足，否则内容层索引无法工作；Node 22 会打一条 `ExperimentalWarning`，属正常，不影响构建。
- 包管理用 pnpm 并锁 `packageManager`，CI 用 `pnpm install --frozen-lockfile`；`pnpm-workspace.yaml` 需用 `nodeLinker: hoisted`，并在 `allowBuilds` 放行需要安装脚本的依赖（如 `esbuild`、`workerd`）。
- `tsconfig.json` 只 `extends ./.nuxt/tsconfig.json`；别名 `@`/`~` → `app/`、`~~` → 仓库根、`#shared` → `shared/`。改 `nuxt.config.ts` 里影响类型 / 别名的配置后跑一次 `nuxt prepare`。
- 依赖需构建脚本时必须在 `pnpm-workspace.yaml` 的 `allowBuilds` 放行，否则 `pnpm install` 报 `ERR_PNPM_IGNORED_BUILDS`。

### 10.2 SSG 静态化与路由登记（关键）

- `nitro.preset` 显式锁死 `static`：Cloudflare 环境变量会把预设切到 `cloudflare-*`，那套产物带 Worker 入口，`wrangler deploy` 会找不到 assets。
- `nitro.prerender`：`crawlLinks: false`（路由由构建脚本全量枚举，不靠爬虫）、`failOnError: true`（缺页 / 渲染报错即构建失败）、`autoSubfolderIndex: false`（`/about` → `about.html`，URL 不带尾斜杠，Giscus 的 pathname 映射依赖此形态）。
- 新增一类页面必须在 `build/` 的路由枚举里同步登记，否则产物没有该页、线上 404：`hooks['prerender:routes']` 在内容库就绪后把 `buildRoutes()` 的全集注入 `ctx.routes`。需登记：各固定页、资源详情页、`/resources/page/:n`、分类页与标签页及其分页、`/api/*.json`、`/404.html`。
- 中文分类 / 标签名传给 `prerender:routes` 时用**原始 UTF-8**，不要预先 `encodeURIComponent`，否则产物文件名变成 `%E5%85%AC...`。
- 分页常量（如每页 24 条）放 `shared/` 供构建枚举与前端共用同一份，避免两处不一致。
- 数据链路：构建期由 `server/routes/` 生成静态 JSON（资源列表、单篇含正文、搜索语料），前端 composable 读取；**不要在组件里直接 `queryCollection`**——预渲染阶段拿不到请求上下文。
- `experimental.payloadExtraction: 'client'`：首屏 payload 内联，客户端导航读预渲染的 `_payload.json`，站内跳转不整页刷新。

### 10.3 内容层与 @nuxt/content

- `content.config.ts` 用 `defineContentConfig` + `zod` 声明资源集合 schema，与第七节 frontmatter 字段一一对应（`title/date/categories/tags/description/stickypost/cover`）；新增字段先改 schema。
- `date` 在 YAML 1.2 下解析为字符串，需专门工具函数按 UTC 解释，避免构建机时区导致日期 / 年份漂移。
- Markdown 配置：`toc` 深度 3；Shiki 双主题键名用 `light` / `dark`（产物出 `--shiki-light/--shiki-dark`，不要用 `default`，否则深色代码块丢高亮）；语言按需登记（bash / json / ts / js / vue / css / md / yaml / powershell / diff 等）。
- 站外链接插件：把 `build/rehype-external-links.ts` 注册进 `content.build.markdown.rehypePlugins`，本地插件以 `{ instance, options, src }` 形式传入；只认 `http(s)`，给 MDC `link` 节点写 `attributes`、给 `<a>` 元素写 `properties`，补 `target="_blank" rel="noopener noreferrer"`。构建期处理，禁用 JS 也生效。
- `renderer.anchorLinks: false`（标题锚点由自定义 Prose 组件输出，避免与默认实现重复）。

### 10.4 主题与首帧防闪

- 三态 `auto`/`light`/`dark` 存 localStorage（沿用约定的 storage key），`useTheme` composable 负责读写、循环切换、订阅变更。
- 落地方式（参考 PidanUI）：`<html>` 同时写 `data-theme`（三态原样，作真源）与 Vuetify 需要的 `.v-theme--light` / `.v-theme--dark` class（Vuetify 的 `--v-theme-*` 变量按 class 切换）；CSS 里深色只写一条。两份标记必须始终同步。
- `auto` 走 `matchMedia('(prefers-color-scheme: dark)')` 监听系统；`resolvedDark = mode==='dark' || (mode==='auto' && systemDark)`。
- **首帧防闪**：`app.head.script` 注入 `tagPriority: 'critical'` 的内联脚本，在首次绘制前读 storage 并落地主题标记，避免深色用户首帧闪白；storage key 必须与 composable 完全一致。
- 参考 StarLight 的做法：`auto` 不写内联 `color-scheme`，交给系统规则；浅 / 深两态可写 `style.colorScheme` 让滚动条、原生控件一起变。
- 主题开关 UI 用 Vuetify 组件表达三态（滑块位置 = 实际是否深色，图标 = 当前模式），SSR 阶段按 `auto` 渲染、挂载后再切真实值，避免 hydration 不一致。

### 10.5 Giscus 评论

- 配置集中放 `shared/site.ts` 的 `GISCUS` 常量（repo / repoId / category / categoryId / mapping=pathname / strict / reactions / input-position / lang / loading），先复制 PidanUI 占位；`SITE.mainUrl` 与分页常量同源。
- 主题皮肤 `public/giscus/light.css`、`dark.css` 从 PidanUI 复制；`public/_headers` 给 `/giscus/*` 补 `Access-Control-Allow-Origin: *`——Cloudflare Workers 静态资源默认不带 CORS，缺了会被浏览器拦掉退回默认皮肤（GitHub Pages 默认带，换平台才暴露）。
- 组件做法（照搬机制）：客户端按路由动态注入 `giscus.app/client.js`（兼容 SPA 导航，路由变化重建避免评论串页）；`IntersectionObserver`（`rootMargin: 400px`）滚到附近才加载，减少首屏开销；主题用 `postMessage({ giscus: { setConfig: { theme } } })` 同步已加载 iframe；骨架屏占位 + 10 秒兜底收起。

### 10.6 搜索对话框

- 关键词与开关状态放 composable 的模块级 `ref`（`searchKeyword` / `searchDialogOpen`），对话框与搜索页共用；`Ctrl / ⌘ + K` 呼出。
- 对话框用 Vuetify 的对话组件承载焦点陷阱 / ESC / 遮罩 / 滚动锁；业务侧只做「关闭后清空关键词 + 焦点还给触发元素」。
- 检索语料为构建期生成的 `/api/search.json`，会话内只请求一次并复用；请求失败不缓存、下次重试。
- 匹配用关键词按空白切 token，对标题 / 正文 / 标签做小写 `includes` 的“与”匹配；状态五态：空关键词 / 语料加载中 / 加载失败 / 无命中 / 有结果，各有提示文案与骨架屏。
- 输入同步地址栏 `?q=` 用 `replaceState`（保留 router state，避免 R0121 报错与输入框失焦）；无 JS 时退化成站内搜索页链接。

### 10.7 字体与图标

- 字体自包含、构建期灌注、仓库不留字体文件、不走 CDN：`sync-fonts.mjs` 在 `nuxi generate` 之后从 npm 包（HarmonyOS Sans SC 分包字体）取 400/500/600/700（Regular/Medium/Semibold/Bold）四档 CSS 与 woff2 分片，写进 `.output/public/fonts/` 并生成 `fonts/harmonyos.css`，`app.head` 只引用这一个本地路径。Cascadia Code 走 `@fontsource/cascadia-code` 由 Vite 打包。
- `<link>` 字体样式表开发 / 生产分流：生产引用生成后的 `harmonyos.css`，开发因尚无构建产物，直接把 npm 包目录挂到 Nitro `publicAssets` 的 `/fonts`。
- 图标 `@nuxt/icon` + 本地 `@iconify-json/mdi`（Material Design Icons）+ `@iconify-json/simple-icons`，构建期内联 SVG（`mode: 'svg'`、`serverBundle` / `clientBundle`），运行时不请求 Iconify API；只装这两个集合。
- 动态 `:name` 绑定的图标扫描不到，必须登记进 `icon.clientBundle.icons`（格式 `mdi:xxx` / `simple-icons:xxx`），否则退化成运行时取图、静态站显示空白。
- `verify-output.mjs` 会检查首页无字体 CDN 引用、且引用了本地 `harmonyos.css`。

### 10.8 构建期脚本与产物校验

- `generate-sitemap.mjs`：复用 `build/` 的可收录路由函数，生成 `.output/public/sitemap.xml`（`SITE.mainUrl` 拼绝对地址）；排除搜索页 / 错误页 / 接口 / 订阅源 / XML / JSON。
- `sync-fonts.mjs`：见 10.7；顺带清理 Nitro 可能留下的 `server/` 与 `.wrangler/`（纯静态站不该有 worker 入口，否则 `wrangler deploy` 失败）。
- `verify-output.mjs`：逐条对账 `buildRoutes()` 是否都有产物（`failOnError` 只抓“枚举了但渲染报错”，抓不到“该枚举却漏了”）；校验 sitemap 与可收录路由一致、无 `server`/`_worker.js`、字体自包含。三脚本任一失败即退出非零，让 CI 构建失败。
- 静态资源响应头 `public/_headers`：`/_nuxt/*`、`/fonts/*` 长缓存 immutable，`/images/*` 一周，`/giscus/*` 补 CORS，全局 `X-Content-Type-Options: nosniff` 等。

### 10.9 部署与 CI

- 部署走 Cloudflare Workers Builds：仓库连 Workers，构建命令 `pnpm build`、部署命令 `npx wrangler deploy`，main 推送自动部署、非生产分支 / PR 自动预览；CI 只做校验不部署。
- `wrangler.jsonc`：assets-only Worker（**无 `main` 字段**，纯静态请求不计费），`assets.directory = .output/public`、`not_found_handling: 404-page`、`html_handling: auto-trailing-slash`、`previews: {}` 启用预览，`observability.enabled: true`。
- 两个独立 CI workflow，同时运行、互不阻塞（prettier 不阻塞检查流程）：检查流 `oxlint` → `tsc` → `build`（`nuxi generate` 同时验证预渲染）；格式流 `prettier --check`。均 `on: push / pull_request / workflow_dispatch`，`concurrency` 设 `cancel-in-progress: true`。
- 格式配置：Prettier `semi: true`、`singleQuote`、`printWidth: 100`、`trailingComma: all`、`endOfLine: auto`（Windows 工作区 CRLF 与 CI LF 共存，写死 LF 会本机全红）；`content/` 与 `public/` 不进 Prettier（MDC / 公式 / 中文长句经不起换行重排）。oxlint 负责“可能出错的地方”，格式化规则交给 Prettier，避免两工具互相改。

### 10.10 代码风格与 TS 前瞻

- TS/JS 语句**一律带分号**（延续 PidanUI：Prettier `semi: true` + lint 规则双兜），不采用 SmartTeachNanfang / EasiAuto 的无分号风格。
- TypeScript 走别名包（如 `npm:@typescript/typescript6@^6.0.2`）：lint 工具链（`typescript-eslint` 一类）暂不兼容 TS 7，故工具走 TS 6 API；升级到 TS 7 前先确认 lint 工具已支持，否则 lint 直接崩。这正是“预留类型声明、为迁移 TS 7 准备”的落点。
- 注释风格：中文、`// ====` 分节横幅，只解释“为什么”，不复述代码。
- 站内链接一律 `<NuxtLink :to>`，严禁裸 `<a href>` 指向站内路由（会退化成整页刷新，丢失页面过渡）；拼链接用 `withBase()`，分类 / 标签名 `encodeURIComponent`。

### 10.11 Markdown 样式支持（较完整，除 Mermaid / TOC）

- 目标：资源正文实现较完整的 Markdown 排版，覆盖参考项目 prose 样式里的全部元素；**明确不做 Mermaid 图与 `[TOC]` 目录**（不引入 mermaid 依赖、不做客户端目录注入）。
- 需覆盖的元素清单（照 PidanUI `prose.css` 逐项落地，用 Vuetify 主题变量而非其 `--ink`/`--brand` 自定义令牌）：
  - 标题 6 级（共用盒模型、仅改字号）、标题 hover 锚点图标；
  - 文本：`p` / `a` / `strong` / `del` / `mark` 高亮 / `sub` `sup` / `kbd`；
  - 列表：有序 / 无序 / 嵌套 / 任务列表（checkbox）/ 定义列表 `dl dt dd`；
  - 引用 `blockquote`（含嵌套）、分隔线 `hr`；
  - 行内 `code` 与代码块（见 10.3：Shiki 双主题、`div[class*="language-"]` 结构、顶部 sticky 语言栏 + 复制按钮、`.line` 逐行）；
  - 表格（`table` 保持 `display: table`、外层中性滚动容器，勿 `display: block` 破坏语义）、图片（限宽自适应、空 `src` 不显示破图）、`<details>` 折叠、脚注（`.footnote-*` / `.footnotes`）；
  - 数学公式：沿用 `remark-math` + `rehype-katex` 出 HTML + MathML，补 `.katex` 排版样式（KaTeX 自带 CSS 由 `nuxt.config.ts` 的 `css` 引入）。
- 落地方式：正文由 `<ContentRenderer>` 渲染，其 DOM 不带组件 scoped 标记，故正文样式写**全局文件**（如 `assets/styles/prose.scss`），不要把全部规则塞进 `<style scoped>` 里靠 `:deep()`。
- 层级约定：正文规则统一包进一个层（如 `@layer components`），保证 Vuetify / Sass 工具类仍能覆盖正文元素；深色只写一条（`.v-theme--dark` 或统一的 `.dark`，与 10.4 双写标记保持一致），不重复写 `[data-theme]` 与 `prefers-color-scheme` 两份。
- 自定义 Prose 组件：放在 `app/components/content/`（文件名即组件名），用于接管默认实现、输出稳定的 DOM 契约供样式依赖——至少覆盖 `ProsePre`（代码块信息栏 + 复制按钮）、`ProseTable`（中性滚动容器）、`ProseH2/H3`（标题 + 独立锚点链接）、`ProseUl/Ol/Li`（干净列表，去默认工具类）。改 DOM 结构须同步改样式。
- 若引入 Vuetify 自带的 `VProse`/typography 方案，优先复用其组件表达，仅为上述 Vuetify 未覆盖的元素写 Sass；不得因此丢掉 Shiki 双主题与代码块复制能力。

### 10.12 Sass 接入 Vuetify 变量机制

- 需求：Sass 预处理器不只是写嵌套样式，还要能读取 / 覆盖 **Vuetify 的 Sass 变量**（如 `$font-family`、主题与间距相关变量），让手写 CSS 与 Vuetify 共享同一套设计令牌，避免两处各写一套颜色 / 圆角 / 断点。
- 接入方式（本项目用 Vuetify 而非参考项目的 Nuxt UI / Tailwind，属本地无先例的接入点，落地时先小样验证）：
  - 依赖：安装 `sass` 与 `vuetify`（Vuetify Nuxt 模块），样式文件用 `.scss` / `.sass`。
  - 在全局样式入口先 `@use 'vuetify/settings' with (...)`（或 Vuetify 版本对应的 settings 入口）覆盖需要的 Sass 变量，再 `@use 'vuetify/styles'` 引入组件样式；覆盖须发生在首次 `@use` 之前，否则变量已定、改不动。
  - 通过 Nuxt `vite.css.preprocessorOptions.scss.additionalData` 把公共变量文件（如 `@use '~/assets/styles/_vars.scss' as *;`）注入每个 SCSS 文件，令组件 `<style lang="scss">` 也能直接用 Vuetify 变量与自定义令牌。
  - Vuetify 的运行时主题（`useTheme` / `v-theme--*` class）与 Sass 编译期变量是两套机制：**颜色 / 深色切换走运行时主题变量，尺寸 / 字体 / 圆角等静态令牌可走 Sass 变量**；不要试图用 Sass 变量控制需要运行时切换的深色状态。
- 与既有约定的衔接：10.7 字体栈、10.4 主题双写标记、10.10 手写样式约束统一从 Sass 变量文件读取，改一处即全站生效；手写 CSS 仍不做大位移 / 旋转等夸张效果。
- 验证：构建产物中组件样式与手写样式取到同一份令牌值；`verify-output.mjs` 仍校验字体自包含与静态预设不受 Sass 接入影响。

## 十一、待补充

（暂无，后续再列）
