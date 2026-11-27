<div align="center">

# EggyResHub-Website

![Last Commit](https://img.shields.io/github/last-commit/PidanUI-Team/EggyResHub-Website?label=Last%20Commit)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.7.0-00DC82?logo=Nuxt&logoColor=white)](https://nuxt.com/)
[![Vuetify](https://img.shields.io/badge/Vuetify-4.3.4-1867C0?logo=Vuetify&logoColor=white)](https://vuetifyjs.com/zh-Hans/)
[![Vue](https://img.shields.io/badge/Vue-3.5.46-4FC08D?logo=Vue.js&logoColor=white)](https://cn.vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?logo=TypeScript&logoColor=white)](https://www.typescriptlang.org/)
[![Sass](https://img.shields.io/badge/Sass-1.108.2-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/)
![License](https://img.shields.io/badge/License-AGPL--3.0-orange)

蛋仔资源站新版网站，使用 Nuxt 4 + @nuxt/content + Vuetify + TypeScript + Sass 构建，通过 `nuxi generate` 静态生成（SSG）后以 assets-only Worker 的形式部署到 Cloudflare Workers。

</div>

## 网站结构

- （待补充）

## 技术栈
|项|选型|
|--|--|
|框架|[Nuxt 4](https://nuxt.com/)（Nitro 预渲染 + SSG，`nitro.prerender.failOnError: true`）|
|内容层|[@nuxt/content v3](https://content.nuxt.com/)（Markdown 内容库，MDC + Shiki 双主题）|
|脚本语言|[TypeScript](https://www.typescriptlang.org/)|
|样式库|[Vuetify 4](https://vuetifyjs.com/zh-Hans/)|
|CSS 预处理器|[Sass](https://sass-lang.com/)（接入 Vuetify Sass 变量机制）|
|图标|[@nuxt/icon](https://nuxt.com/modules/icon)（Material Design Icons + Simple Icons，构建期内联 SVG）|

## 数据文件

- `content/[category]/*.md` —— 资源文章（唯一内容源），frontmatter 字段见 `content.config.ts`。
- `app/data/nav.ts` —— 左侧边栏导航（`MAIN_NAV`）。
- `app/data/home.ts` —— 首页文案配置。
- `app/data/links.ts` —— 友情链接列表。
- `app/data/communities.ts` —— 社区推广链接列表。
- `app/data/about.ts` —— 关于页文案配置。
- `app/data/folders.ts` —— 文章文件夹登记列表。
- `shared/site.ts` —— 站点信息、分页大小（`PAGE_SIZE`）、Giscus 配置（无工具清单）。

## 构建步骤

1. [下载并安装 Node.js](https://nodejs.org/zh-cn)（建议使用最新版本）
2. 安装 `pnpm`：`npm install -g pnpm`（`pnpm --version` 可验证）
3. 在项目文件夹下执行 `pnpm install`
4. `pnpm dev` 启动开发服务器（默认 `http://localhost:3000`）
5. `pnpm build` = `nuxi generate` + 生成根目录 `sitemap.xml` + 注入自包含字体 + 产物校验（`scripts/verify-output.mjs`），静态产物输出在 **`.output/public`**
6. `pnpm preview` 用 `wrangler dev` 按 Cloudflare 的规则预览产物；`pnpm deploy` 构建并发布到 Cloudflare Workers

> [!TIP]
> 如果 `npm install` 安装较慢，可先执行 `npm config set registry https://registry.npmmirror.com` 切换至镜像源。

## 字体与图标

字体**自包含**，仓库不保留任何字体文件，运行时也不请求任何字体 CDN：

- HarmonyOS Sans SC（400 / 500 / 600 / 700 四个字重，按 unicode-range 分片）由 `harmonyos-sans-sc-webfont-splitted` 提供，`nuxi generate` **之后**由 `scripts/sync-fonts.mjs` 把四档 CSS 与数百个 `woff2` 分片平铺复制进 `.output/public/fonts/`，并生成 `fonts/harmonyos.css`（`nuxt.config.ts` 的 `app.head` 引用它）；
- Cascadia Code 由 `@fontsource/cascadia-code` 提供，在 `main.css` 里 `@import` 400 / 700 两档，交给 Vite 打包（产物是 `_nuxt/` 下的 hash 文件）。

图标使用 @nuxt/icon 的 Iconify（Material Design Icons + Simple Icons），图标集合以 `@iconify-json/*` 本地安装，**构建期直接内联为 SVG**，运行时不请求 Iconify API。

## 部署方式

本网站以 **Cloudflare Workers Static Assets**（assets-only，没有 Worker 脚本）的形式对外提供服务。`wrangler.jsonc` 固定了资产目录（`.output/public`）、404 页与 HTML 处理规则，维护者执行 `pnpm deploy` 即完成「`nuxi generate` → 字体灌注 → `wrangler deploy`」。`public/_headers` 负责响应头：`/giscus/*` 补 `Access-Control-Allow-Origin: *`（giscus iframe 跨源拉取皮肤，Workers 静态资源默认不带 CORS 头），`_nuxt` 与 `fonts` 走长缓存。站点没有后端，所有内容以静态资源形式存在，更新时需重新构建并部署。

## 许可证

本项目采用 **AGPL v3** 许可证。

**禁止商业用途。** 任何个人或组织不得将本项目及其衍生作品用于商业目的。使用、修改、分发本项目时，请遵守 AGPL v3 的相关条款。

## 版权声明

- 本项目为《蛋仔派对》相关资源收集站，由《蛋仔派对》爱好者打造，**非《蛋仔派对》官方站点**，禁止将本项目及其衍生作品用于商业用途。
- 《蛋仔派对》是网易游戏的注册商标，本项目与网易无任何隶属或赞助关系。