export const ABOUT_INTRO = '蛋仔资源站是由《蛋仔派对》爱好者打造的一个蛋仔相关资源站点。';

export interface AboutItem {
  title: string;
  content: string | string[];
}

export const ABOUT_ITEMS: AboutItem[] = [
  {
    title: '技术栈',
    content: ['Nuxt 4', 'Vuetify 4', 'TypeScript', 'Sass'],
  },
  {
    title: '开源许可',
    content: '禁止商业用途',
  },
];
