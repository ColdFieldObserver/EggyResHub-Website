import { SITE } from '#shared/site';

/** 「关于」对话框内容：简介、技术栈、联系方式、版权声明、开源声明。 */
export const ABOUT = {
  intro: `${SITE.brand}是一个集中展示与检索蛋仔相关资源的非盈利站点，${SITE.tagline}。`,
  stack: [
    'Nuxt 4（SSG 静态生成）',
    '@nuxt/content（资源内容驱动）',
    'Vuetify 4（组件与样式）',
    'TypeScript + Sass',
    'Cloudflare Workers（Static Assets）',
  ],
  contact: '问题反馈：eggyui.mysxl.cn',
  copyright: '资源与宣传图版权归各自作者及网易所有，仅作个人学习与非商业展示使用。',
  opensource: '本站前端代码开源，欢迎提交改进建议与贡献；第三方资源请遵循其原始许可。',
} as const;
