<script setup lang="ts">
// 三态主题开关：跟随系统 / 浅色 / 深色，点击按 auto → light → dark → auto 循环。
// SSR 阶段按 auto + 浅色渲染，挂载后再切真实值，避免 hydration 不一致。
import { computed, onMounted, ref } from 'vue';
import { useSiteTheme, type ThemeMode } from '~/composables/useSiteTheme';

const { mode, resolvedDark, cycle } = useSiteTheme();

const mounted = ref(false);
onMounted(() => {
  mounted.value = true;
});

const LABELS: Record<ThemeMode, string> = {
  auto: '跟随系统',
  light: '浅色模式',
  dark: '深色模式',
};

const shownMode = computed<ThemeMode>(() => (mounted.value ? mode.value : 'auto'));
const label = computed(() => LABELS[shownMode.value]);
const isDark = computed(() => mounted.value && resolvedDark.value);

// 图标语义：显示当前处于哪种模式
const ICONS: Record<ThemeMode, string> = {
  auto: 'mdi:theme-light-dark',
  light: 'mdi:white-balance-sunny',
  dark: 'mdi:weather-night',
};
const icon = computed(() => ICONS[shownMode.value]);
</script>

<template>
  <VBtn
    variant="text"
    :aria-label="`切换主题，当前${label}`"
    :title="`当前：${label}（点击切换）`"
    class="theme-toggle"
    @click="cycle"
  >
    <Icon :name="icon" size="20" aria-hidden="true" />
    <span class="theme-toggle__label">{{ label }}</span>
  </VBtn>
</template>

<style scoped lang="scss">
.theme-toggle {
  min-width: 40px;
}
.theme-toggle__label {
  margin-left: 6px;
  font-size: 0.82rem;
}
@media (max-width: $breakpoint-lg) {
  .theme-toggle__label {
    display: none;
  }
}
</style>
