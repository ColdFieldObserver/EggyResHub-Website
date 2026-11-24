import { ref } from 'vue';

// ============================================================
// 左侧边栏收起状态（全局可收起，桌面端默认展开）。
// 顶栏最左的菜单按钮切换这里的状态，所有页面共享。
// 保持 Vuetify 默认行为：不做移动端抽屉手势等增强 Hook。
// ============================================================

export const sidebarOpen = ref(true);

export function toggleSidebar(): void {
  sidebarOpen.value = !sidebarOpen.value;
}

export function closeSidebarOnMobile(): void {
  // 窄屏下点导航项后收起；宽屏保持展开（桌面端默认展开）
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    sidebarOpen.value = false;
  }
}
