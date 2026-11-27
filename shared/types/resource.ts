/** 资源卡片 / 列表项使用的轻量资源结构（来自构建期静态 JSON）。 */
export interface Resource {
  /** 详情页路径，形如 /resources/<slug> */
  path: string;
  title: string;
  /** 所属文件夹（content/<folder>/ 的第一层目录名），分类页三层结构的第一层 */
  folder: string;
  /** 原始日期字符串（YYYY-MM-DD HH:mm:ss），统一按 UTC 解释 */
  date: string;
  /** 格式化后的展示日期 */
  displayDate: string;
  categories: string[];
  tags: string[];
  description: string;
  /** 是否在首页特色资源轮播框展示 */
  stickypost: boolean;
  /** 封面地址，缺省时回退到默认封面 */
  cover: string;
}

/** 首页「蛋仔小技巧」条目。 */
export interface Tip {
  icon: string;
  title: string;
  description: string;
}

/** 友情链接 / 社区推广的列表项。 */
export interface LinkItem {
  /** 图片图标地址 */
  icon: string;
  title: string;
  description: string;
  href: string;
}
