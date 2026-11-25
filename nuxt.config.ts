import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRoutes } from './build/content-index';
import { rehypeExternalLinksBlank } from './build/rehype-external-links';
import { SITE, THEME_STORAGE_KEY } from './shared/site';

// ============================================================
// 蛋仔资源站 · Nuxt 站点配置
//   - 纯静态站点：`nuxi generate` 产出 .output/public，
//     以 assets-only Worker 的形式部署到 Cloudflare Workers
//   - 内容由 @nuxt/content v3 驱动（content/ 下任意层级的 *.md）
//   - 样式层为 Vuetify 4（Sass 变量经 vuetify-nuxt-module 注入）+ 少量手写 SCSS
//   - 主题三态由自建 useSiteTheme 独占（data-theme + .dark/.light 双写）
// ============================================================

// ---- 字体（自包含）----
// 生产：`nuxi generate` 之后由 scripts/sync-fonts.mjs 生成 /fonts/harmonyos.css；
// 开发：还没有那次构建，直接把 npm 包里的三档样式（含同目录 woff2 分片）挂到
//       Nitro 的 /fonts 下，否则 dev 下样式表 404、正文会掉到系统字体。
const require = createRequire(import.meta.url);
const isDev = process.env.NODE_ENV === 'development';
let harmonyFontsDir = '';
try {
  harmonyFontsDir = dirname(require.resolve('harmonyos-sans-sc-webfont-splitted'));
} catch {
  // 包没装时不挂载：构建会由 sync-fonts.mjs 直接报错，比这里静默失败更明确
}

const FONT_LINKS = isDev
  ? [
      { rel: 'stylesheet', href: '/fonts/Regular.css' },
      { rel: 'stylesheet', href: '/fonts/Medium.css' },
      { rel: 'stylesheet', href: '/fonts/Semibold.css' },
      { rel: 'stylesheet', href: '/fonts/Bold.css' },
    ]
  : [{ rel: 'stylesheet', href: '/fonts/harmonyos.css' }];

// 项目自有 Sass 变量注入：把 app/assets/styles 加进 Sass loadPaths，
// 再用 additionalData 给每个 scss 文件（含组件 <style lang="scss">）注入
// `@use 'vars' as *;`。_vars.scss 只含纯变量定义（不含任何 @use / 规则），
// 保证不破坏 Vuetify settings.scss 里 `@use 'vuetify/settings' with (...)`
// 的「必须最先加载」约束。
const VARS_DIR = fileURLToPath(new URL('./app/assets/styles', import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  ssr: true,
  devtools: { enabled: true },

  modules: ['@nuxt/content', '@nuxt/icon', 'vuetify-nuxt-module'],

  // ============================================================
  // Vuetify 4 接入
  //   - styles.configFile：把 app/assets/styles/settings.scss 作为
  //     Vuetify Sass 变量入口（@use 'vuetify/settings' with (...)）
  //   - icons: false：图标统一走 @nuxt/icon，禁用 Vuetify 默认的 mdi CDN
  //   - theme：运行时主题（浅/深两套），三态切换由 useSiteTheme 驱动
  // ============================================================
  vuetify: {
    moduleOptions: {
      // vuetify 自动导入的 useLayout 与 Nuxt 内置同名会重复导入并告警，
      // 给 vuetify 的 composables 统一加 V 前缀（useTheme -> useVTheme 等）。
      // 布局里需要的是 Vuetify 框架的 useTheme，直接从 'vuetify' 显式 import，不受影响。
      prefixComposables: true,
    },
    vuetifyOptions: {
      styles: { configFile: 'assets/styles/settings.scss' },
      icons: false,
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              // 默认配色参考 PidanUI 官网（品牌黄）
              primary: '#ff9f1a',
              'primary-soft': '#ffc53d',
              secondary: '#8b5cf6',
              background: '#fafbfc',
              surface: '#ffffff',
              error: '#e5484d',
            },
          },
          dark: {
            dark: true,
            colors: {
              primary: '#ffc53d',
              'primary-soft': '#ff9f1a',
              secondary: '#a78bfa',
              background: '#121316',
              surface: '#1c1e22',
              error: '#ff6b6b',
            },
          },
        },
      },
    },
  },

  app: {
    baseURL: '/',
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'author', content: SITE.author },
        {
          name: 'keywords',
          content:
            '蛋仔资源站, EggyResHub, 蛋仔派对, 蛋仔资源, 蛋仔美化, 蛋仔主题, 蛋仔壁纸, 蛋仔组件, 二创资源',
        },
        { name: 'description', content: `${SITE.brand} - ${SITE.tagline}` },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/favicon.png' },
        // 界面字体（自包含）：生产由 sync-fonts.mjs 生成 harmonyos.css；
        // 开发由下面的 nitro.publicAssets 直接挂 npm 包目录。仓库不保留字体文件，也不走 CDN。
        ...FONT_LINKS,
      ],
      script: [
        // 首帧同步脚本（关键）：在首次绘制前把用户选择的主题写入 <html data-theme>，
        // 并同时切三类标记：
        //   .dark / .light        —— 手写样式与正文深色规则
        //   .v-theme--dark/light  —— Vuetify 主题变量（含 color-scheme），
        //                            原生 <input>/滚动条按它上色
        // 两类必须同步落地：Vuetify 4 的浅色变量挂在 :root、深色变量挂在
        // .v-theme--dark 类上。若只写 color-scheme 而不加 v-theme--dark，
        // CSS 变量仍是浅色、原生控件却是深色，搜索框就会「颜色反过来」。
        // 不要在 <html> 上内联写 style.colorScheme：它优先级高于 Vuetify 的类，
        // 会覆盖 .v-theme--dark 自带的 color-scheme，导致同样的错配。
        // storage key 与 useSiteTheme.ts 保持一致。
        {
          innerHTML:
            `try{var m=localStorage.getItem("${THEME_STORAGE_KEY}")||"auto";` +
            'var d=m==="dark"||(m==="auto"&&matchMedia("(prefers-color-scheme: dark)").matches);' +
            'var r=document.documentElement;r.setAttribute("data-theme",m);' +
            'r.classList.toggle("dark",d);r.classList.toggle("light",!d);' +
            'r.classList.toggle("v-theme--dark",d);r.classList.toggle("v-theme--light",!d)' +
            '}catch(e){var r=document.documentElement;r.setAttribute("data-theme","auto");r.classList.add("light","v-theme--light")}',
          tagPriority: 'critical',
        },
        // 首帧同步脚本：DOM 解析时立即给 <html> 加 .js。
        // 禁用 JS 时此脚本不执行，所有 html:not(.js) 的降级 CSS 规则自动生效。
        {
          innerHTML: 'document.documentElement.classList.add("js");',
          tagPriority: 'critical',
        },
      ],
    },
    // 页面切换淡入淡出（见 animation.scss）
    pageTransition: { name: 'page', mode: 'out-in', appear: true },
  },

  // katex 自带样式 + Cascadia Code 自包含字体（@fontsource，由 Vite 打包）
  // + 项目样式入口（正文样式在 prose.scss 里，包在 @layer components）
  css: [
    'katex/dist/katex.min.css',
    '@fontsource/cascadia-code/400.css',
    '@fontsource/cascadia-code/700.css',
    '~/assets/styles/main.scss',
    '~/assets/styles/prose.scss',
    '~/assets/styles/animation.scss',
  ],

  // 组件按文件名注册（<ResourceCard> / <CardGrid> …），模板保持零改动
  components: [{ path: '~/components', pathPrefix: false }],

  // 图标：只用本地 @iconify-json 集合，构建期直接内联 SVG。
  // 不配置时 @nuxt/icon 会在渲染期向 Iconify API 取图 —— 静态站点必须离线可用。
  icon: {
    mode: 'svg',
    serverBundle: { collections: ['mdi', 'simple-icons'] },
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
      // scan 认不出动态绑定的图标（:name="item.icon"），必须显式列出。
      icons: [
        'mdi:home',
        'mdi:home-outline',
        'mdi:view-grid',
        'mdi:view-grid-outline',
        'mdi:folder-multiple',
        'mdi:folder-multiple-outline',
        'mdi:tag-multiple',
        'mdi:tag-multiple-outline',
        'mdi:link-variant',
        'mdi:account-group',
        'mdi:account-group-outline',
        'mdi:menu',
        'mdi:menu-open',
        'mdi:magnify',
        'mdi:close',
        'mdi:chevron-left',
        'mdi:chevron-right',
        'mdi:chevron-down',
        'mdi:information-outline',
        'mdi:white-balance-sunny',
        'mdi:weather-night',
        'mdi:theme-light-dark',
        'mdi:calendar-blank',
        'mdi:text-box-outline',
        'mdi:open-in-new',
        'mdi:arrow-right',
        'mdi:arrow-up',
        'mdi:lightbulb-outline',
        'mdi:palette-outline',
        'mdi:tools',
        'mdi:image-outline',
        'mdi:content-copy',
        'mdi:check',
        'mdi:github',
        'mdi:web',
        'mdi:rss',
        'simple-icons:github',
        'simple-icons:bilibili',
        'simple-icons:tencentqq',
        'simple-icons:windows',
      ],
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 每个 scss 文件（含组件 <style lang="scss">）都能直接用 _vars.scss 的变量
          loadPaths: [VARS_DIR],
          additionalData: `@use 'vars' as *;\n`,
        },
      },
    },
  },

  nitro: {
    // 显式锁死 static：Cloudflare 上的环境变量会把预设切到 cloudflare-*，
    // 那套产物带 Worker 入口，wrangler deploy 会找不到 assets 目录。
    preset: 'static',
    // 开发期直接挂 npm 包里的 HarmonyOS Sans SC 分片（生产产物由 sync-fonts.mjs 灌注）
    publicAssets:
      isDev && harmonyFontsDir
        ? [{ dir: harmonyFontsDir, baseURL: '/fonts', maxAge: 0 }]
        : undefined,
    prerender: {
      crawlLinks: false, // 路由由 buildRoutes() 全量枚举，不依赖爬虫
      failOnError: true, // 缺页必须让 CI 失败
      autoSubfolderIndex: false, // /about → about.html，URL 保持无尾斜杠
    },
  },

  hooks: {
    // 唯一的路由枚举入口：内容库就绪之后、预渲染之前
    'prerender:routes'(ctx) {
      for (const route of buildRoutes()) ctx.routes.add(route);
    },
  },

  content: {
    // 用 Node 内置的 node:sqlite 做内容索引数据库，免掉 better-sqlite3 的原生编译。
    // Node 22 会打一条 ExperimentalWarning，属正常，不影响构建。
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 3 },
        highlight: {
          // 键名必须是 light / dark：产物才是 --shiki-light / --shiki-dark，
          // 与 prose.scss 里自行应用的双主题规则对齐；default 是类型要求的基础主题
          theme: { default: 'github-light', light: 'github-light', dark: 'github-dark' },
          langs: [
            'bash',
            'shell',
            'sh',
            'json',
            'js',
            'ts',
            'html',
            'css',
            'scss',
            'vue',
            'md',
            'yaml',
            'powershell',
            'ini',
            'diff',
          ],
        },
        remarkPlugins: { 'remark-math': {} },
        rehypePlugins: {
          'rehype-katex': { output: 'htmlAndMathml' },
          // 站外链接一律新开标签页，站内相对路径/锚点保持原样
          'rehype-external-links-blank': {
            instance: rehypeExternalLinksBlank,
            options: {},
            src: fileURLToPath(
              new URL('./build/rehype-external-links.ts', import.meta.url),
            ).replaceAll('\\', '/'),
          },
        },
      },
    },
  },

  experimental: {
    // 首屏 payload 内联，客户端导航读预渲染的 _payload.json
    payloadExtraction: 'client',
  },

  typescript: {
    strict: true,
  },
});
