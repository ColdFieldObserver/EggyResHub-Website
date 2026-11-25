<script setup lang="ts">
// 首页特色资源轮播框：展示 stickypost: true 的资源。
// 样式仿 SmartTeachNanfang 项目的 banner：整条 track 横向平移切换，
// 左右箭头浮在图片两侧（hover 显现、键盘可聚焦），进度点居中偏下且当前点拉长，
// 标题用底部渐变横幅承载。只做平滑位移，不做旋转等夸张效果。
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { Resource } from '#shared/types/resource';

const props = defineProps<{ resources: Resource[]; interval?: number }>();
const gap = computed(() => (props.interval ?? 5) * 1000);

const index = ref(0);
const count = computed(() => props.resources.length);
const current = computed<Resource | undefined>(() => props.resources[index.value]);

let timer: number | undefined;

function go(step: number): void {
  if (!count.value) return;
  index.value = (index.value + step + count.value) % count.value;
  restart();
}
function goTo(i: number): void {
  index.value = i;
  restart();
}
function restart(): void {
  if (typeof window === 'undefined' || count.value <= 1) return;
  if (timer) window.clearInterval(timer);
  timer = window.setInterval(() => go(1), gap.value);
}

onMounted(restart);
onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer);
});
</script>

<template>
  <div class="featured">
    <template v-if="current">
      <div class="featured__track" :style="{ transform: `translateX(-${index * 100}%)` }">
        <NuxtLink
          v-for="resource in resources"
          :key="resource.path"
          :to="resource.path"
          class="featured__slide"
        >
          <img class="featured__cover" :src="resource.cover" :alt="resource.title" />
          <div class="featured__caption">{{ resource.title }}</div>
        </NuxtLink>
      </div>

      <div v-if="count > 1" class="featured__dots">
        <button
          v-for="(_, i) in resources"
          :key="i"
          type="button"
          class="featured__dot"
          :class="{ 'is-active': i === index }"
          :aria-label="`切换到第 ${i + 1} 张`"
          :aria-current="i === index ? 'true' : undefined"
          @click="goTo(i)"
        />
      </div>

      <VBtn
        v-if="count > 1"
        variant="text"
        density="comfortable"
        size="small"
        class="featured__arrow featured__arrow--left"
        aria-label="上一张"
        @click="go(-1)"
      >
        <Icon name="mdi:chevron-left" size="24" aria-hidden="true" />
      </VBtn>
      <VBtn
        v-if="count > 1"
        variant="text"
        density="comfortable"
        size="small"
        class="featured__arrow featured__arrow--right"
        aria-label="下一张"
        @click="go(1)"
      >
        <Icon name="mdi:chevron-right" size="24" aria-hidden="true" />
      </VBtn>
    </template>

    <div v-else class="featured__empty muted-text">暂无特色资源</div>
  </div>
</template>

<style scoped lang="scss">
.featured {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: $radius-lg;
  background: rgb(var(--v-theme-surface));
}
.featured__track {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  transition: transform 0.5s cubic-bezier(0.2, 0, 0, 1);
}
.featured__slide {
  position: relative;
  display: block;
  flex: 0 0 100%;
  height: 100%;
  overflow: hidden;
  text-decoration: none;
}
.featured__cover {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.featured__caption {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1.6rem 1rem 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.72));
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
}
@media (min-width: 600px) {
  .featured__caption {
    padding: 2rem 1.5rem 1.1rem;
    font-size: 1.05rem;
  }
}
.featured__dots {
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  z-index: 2;
  display: flex;
  gap: 0.5rem;
  transform: translateX(-50%);
}
.featured__dot {
  width: 0.5rem;
  height: 0.5rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  transition:
    width 0.25s ease,
    background 0.25s ease;
}
.featured__dot.is-active {
  width: 1.45rem;
  background: #fff;
  border-radius: 0.5rem;
}
.featured__arrow {
  position: absolute;
  top: 50%;
  z-index: 2;
  color: #fff;
  background: rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(4px);
  transform: translateY(-50%);
  transition:
    opacity $transition-fast ease,
    background $transition-fast ease;

  &:hover,
  &:focus-visible {
    background: rgba(0, 0, 0, 0.62);
  }
}
.featured__arrow--left {
  left: 0.5rem;
}
.featured__arrow--right {
  right: 0.5rem;
}
// 桌面端 hover 容器才显现箭头（与参考项目一致）；触屏无 hover 时保持常显，
// 键盘聚焦时也显现，避免不可访问的按钮。
@media (hover: hover) {
  .featured__arrow {
    opacity: 0;
  }
  .featured:hover .featured__arrow,
  .featured__arrow:focus-visible {
    opacity: 1;
  }
}
.featured__empty {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 220px;
}

@media (prefers-reduced-motion: reduce) {
  .featured__track {
    transition: none;
  }
}
</style>
