import type { LinkItem } from '#shared/types/resource';

// 友情链接：内容目前先从 PidanUI 官网复制（app/data/socialLinks.ts 的 FRIEND_LINKS），
// 图标统一换成 MDI / Simple Icons（本项目只装这两个集合）。
// 后续按本站实际合作站点调整，只改数据文件、不动版式。
export const FRIEND_LINKS: LinkItem[] = [
  {
    title: 'PidanUI 上线了官网',
    description: '蛋仔风格桌面美化项目的官方站点。',
    href: 'https://eggyui.mysxl.cn',
    icon: 'mdi:web',
  },
  {
    title: 'OpenPidanUI 官网',
    description: '开源的蛋仔风格 UI 组件项目官网。',
    href: 'https://open.pidanui.eggycore.top',
    icon: 'mdi:github',
  },
  {
    title: 'EggyUI / PidanUI 文档站',
    description: '项目使用文档与常见问题汇总。',
    href: 'https://eggyuidocs.wordpress.com',
    icon: 'mdi:text-box-outline',
  },
  {
    title: 'BSOD-MEMZ的个人基地',
    description: '个人技术站，分享桌面美化与折腾记录。',
    href: 'https://xxtsoft.top',
    icon: 'simple-icons:windows',
  },
  {
    title: '红蓝灯的秘密基地',
    description: '个人博客，记录各类小项目与想法。',
    href: 'https://cn-rbl.github.io',
    icon: 'mdi:lightbulb-outline',
  },
  {
    title: '冷域观者的个人网站',
    description: '数字身份与创作档案站点。',
    href: 'https://coldfield.skystarlight.top',
    icon: 'mdi:image-outline',
  },
];
