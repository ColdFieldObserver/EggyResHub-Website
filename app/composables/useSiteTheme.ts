import { computed, ref } from 'vue';
import { THEME_STORAGE_KEY } from '#shared/site';

// ============================================================
// 主题模式（跟随系统 / 浅色 / 深色）
//
// 通过 <html data-theme> 驱动手写样式，并用 localStorage 持久化。
// auto 模式走 prefers-color-scheme 跟随系统。
// 同时给 <html> 写 .dark / .light —— 手写正文样式与首帧防闪按 class 切换。
// Vuetify 组件主题则由 useTheme().global.name 同步（见 applyVuetify）。
// 首帧防闪由 nuxt.config.ts 的 <head> 内联脚本负责读取同一 storage key。
// ============================================================

export type ThemeMode = 'auto' | 'light' | 'dark';

/** 循环切换顺序 */
export const THEME_MODES: ThemeMode[] = ['auto', 'light', 'dark'];

function readStored(): ThemeMode {
  if (typeof window === 'undefined') return 'auto';
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === 'light' || value === 'dark' || value === 'auto') return value;
  } catch {
    // localStorage 不可用（隐私模式）时回退 auto
  }
  return 'auto';
}

const mode = ref<ThemeMode>(readStored());
const systemDark = ref(false);

/** 当前实际是否为深色（auto 时取系统偏好） */
export const resolvedDark = computed(
  () => mode.value === 'dark' || (mode.value === 'auto' && systemDark.value),
);

type ThemeListener = (dark: boolean) => void;
const listeners = new Set<ThemeListener>();
let bound = false;

/** 同步 Vuetify 运行时主题（组件颜色），同时给 <html> 打 v-theme class 供 CSS 用。 */
function applyVuetify(dark: boolean): void {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  // Vuetify 4 的组件颜色取自 v-theme--light / v-theme--dark class 下的 CSS 变量，
  // 由 VApp 挂在其根节点；这里在 <html> 上也补一份，保证手写 CSS 与 SSR 首帧一致。
  root.classList.toggle('v-theme--dark', dark);
  root.classList.toggle('v-theme--light', !dark);
  root.dataset.vuetifyTheme = dark ? 'dark' : 'light';
}

function apply(): void {
  if (typeof document === 'undefined') return;
  const dark = resolvedDark.value;
  const root = document.documentElement;
  // data-theme 是三态真源，供 [data-theme] 选择器使用
  root.setAttribute('data-theme', mode.value);
  // .dark / .light 供手写样式与首帧防闪使用
  root.classList.toggle('dark', dark);
  root.classList.toggle('light', !dark);
  applyVuetify(dark);
  for (const listener of listeners) listener(dark);
}

function bindSystem(): void {
  if (bound || typeof window === 'undefined') return;
  bound = true;
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  systemDark.value = query.matches;
  query.addEventListener?.('change', (event) => {
    systemDark.value = event.matches;
    apply();
  });
}

/** 初始化：绑定系统监听并落地当前主题（幂等，可在任意组件 setup 调用） */
export function initTheme(): void {
  if (typeof window === 'undefined') return;
  bindSystem();
  apply();
}

export function setThemeMode(next: ThemeMode): void {
  mode.value = next;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // 持久化失败不影响本次切换
  }
  apply();
}

/** 三态循环：auto → light → dark → auto */
export function cycleThemeMode(): void {
  const index = THEME_MODES.indexOf(mode.value);
  const next = THEME_MODES[(index + 1) % THEME_MODES.length] ?? 'auto';
  setThemeMode(next);
}

/** 订阅主题变化（返回取消订阅函数），供 Giscus 等第三方渲染同步 */
export function onThemeChange(listener: ThemeListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSiteTheme() {
  initTheme();
  return {
    mode,
    resolvedDark,
    setMode: setThemeMode,
    cycle: cycleThemeMode,
  };
}
