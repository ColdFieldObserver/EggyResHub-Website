import type { Tip } from '#shared/types/resource';

// 首页「蛋仔小技巧」列表内容（计划要求在此文件定义）。
export const HOME_TIPS: Tip[] = [
  {
    icon: 'mdi:palette-outline',
    title: '配色先定深浅两套',
    description: '做主题前先在浅色与深色模式下各看一遍主色，避免浅底上看不清文字。',
  },
  {
    icon: 'mdi:image-outline',
    title: '封面统一 16:9',
    description: '资源封面按 16:9 居中裁剪，卡片网格才不会高低不齐；缺省时会自动用默认封面。',
  },
  {
    icon: 'mdi:magnify',
    title: 'Ctrl + K 快速搜索',
    description: '任意页面按 Ctrl / ⌘ + K 呼出搜索对话框，输入关键词即可检索全站资源。',
  },
  {
    icon: 'mdi:tools',
    title: '轮播图放外部目录',
    description: '挂件类资源的轮播图建议放独立文件夹动态读取，换图不必重新打包程序。',
  },
];

export interface SocialLink {
  label: string;
  icon: string;
  href: string;
}

// 首页下部区块：社交链接。
export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', icon: 'simple-icons:github', href: 'https://github.com' },
  { label: 'Bilibili', icon: 'simple-icons:bilibili', href: 'https://www.bilibili.com' },
  { label: 'QQ', icon: 'simple-icons:tencentqq', href: 'https://im.qq.com' },
];
