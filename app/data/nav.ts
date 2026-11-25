// 左侧边栏导航：顶栏、侧栏共用同一份数据源。
// 图标用 @nuxt/icon 的 MDI 集合（构建期内联 SVG）。

export interface NavItem {
  label: string;
  to: string;
  icon: string;
  /** 精确匹配（首页用），否则按前缀高亮 */
  exact?: boolean;
}

export const MAIN_NAV: NavItem[] = [
  { label: '首页', to: '/', icon: 'mdi:home', exact: true },
  { label: '全部资源', to: '/resources/', icon: 'mdi:view-grid' },
  { label: '资源分类', to: '/categories/', icon: 'mdi:folder-multiple' },
  { label: '资源标签', to: '/tags/', icon: 'mdi:tag-multiple' },
  { label: '友情链接', to: '/links', icon: 'mdi:link-variant' },
  { label: '社区推广', to: '/community', icon: 'mdi:account-group' },
];
