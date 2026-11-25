<script setup lang="ts">
// 全站右下角「返回顶部」按钮：用 Vuetify VBtn 实现，向下滚动超过阈值后出现，
// 点击平滑滚回顶部。SSR 阶段隐藏（挂载后再按滚动位置显示），避免 hydration 不一致。
import { onBeforeUnmount, onMounted, ref } from 'vue';

const THRESHOLD = 320;
const visible = ref(false);

// 直接同步更新：只读一次 scrollY + 布尔比较，开销可忽略，
// 也不依赖 requestAnimationFrame（在无头/后台标签页等场景 rAF 可能被节流）。
function onScroll(): void {
  visible.value = window.scrollY > THRESHOLD;
}
function toTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
</script>

<template>
  <Transition name="back-to-top">
    <VBtn
      v-show="visible"
      icon
      variant="tonal"
      color="primary"
      class="back-to-top"
      aria-label="返回顶部"
      title="返回顶部"
      @click="toTop"
    >
      <Icon name="mdi:arrow-up" size="22" aria-hidden="true" />
    </VBtn>
  </Transition>
</template>

<style scoped lang="scss">
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 100;
}
.back-to-top-enter-active,
.back-to-top-leave-active {
  transition:
    opacity $transition-fast ease,
    transform $transition-fast ease;
}
.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
@media (max-width: $breakpoint-lg) {
  .back-to-top {
    right: 16px;
    bottom: 16px;
  }
}
</style>
