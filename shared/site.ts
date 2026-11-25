/**
 * 站点常量：站点信息、分页与评论配置。
 * 前端组件与构建期脚本（build/、scripts/）共用同一份，避免两处不一致。
 */

export const SITE = {
  /** 站点品牌名 */
  brand: '蛋仔资源站',
  /** 站点英文标识（用于 storage key 等） */
  slug: 'eggyreshub',
  /** 站点副标题 */
  tagline: '一站式获取蛋仔相关资源',
  /** 作者 / 组织 */
  author: 'EggyResHub',
  /** 官网根地址（Cloudflare Workers 部署地址） */
  mainUrl: 'https://eggyreshub.skystarlight.top',
} as const;

/** 全部资源页每页显示的资源卡片数量 */
export const PAGE_SIZE = 24;

/** 首页「最新资源」列表条数 */
export const LATEST_COUNT = 8;

/** localStorage 存储的主题模式 key（须与首帧内联脚本、useTheme 保持一致） */
export const THEME_STORAGE_KEY = 'eggyreshub-theme';

/**
 * Giscus 评论配置：配置先复制 PidanUI 官网占位，主题皮肤直接从其官网复制。
 * 站点正式接入仓库后需替换 repo / repoId / category / categoryId。
 */
export const GISCUS = {
  repo: 'PidanUI-Team/PidanUI-Website',
  repoId: 'R_kgDOU8wvkw',
  category: 'Announcements',
  categoryId: 'DIC_kwDOU8wvk84DHGnO',
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  lang: 'zh-CN',
  loading: 'lazy',
} as const;
