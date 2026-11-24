<script setup lang="ts">
// 首页特色资源轮播框：展示 stickypost: true 的资源。
// 左下角显示标题、中间显示封面，定时自动切换，可用 < > 手动切换。
// 只做淡入淡出，不做大位移 / 旋转等夸张效果。
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
  if (typeof window === 'undefined') return;
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
      <NuxtLink :to="current.path" class="featured__link">
        <img class="featured__cover" :src="current.cover" :alt="current.title" />
        <div class="featured__caption">{{ current.title }}</div>
      </NuxtLink>

      <div v-if="count > 1" class="featured__controls">
        <VBtn variant="text" density="comfortable" size="small" aria-label="上一张" @click="go(-1)">
          <Icon name="mdi:chevron-left" size="22" aria-hidden="true" />
        </VBtn>
        <div class="featured__dots">
          <button
            v-for="(_, i) in resources"
            :key="i"
            type="button"
            class="featured__dot"
            :class="{ 'is-active': i === index }"
            :aria-label="`切换到第 ${i + 1} 张`"
            @click="goTo(i)"
          />
        </div>
        <VBtn variant="text" density="comfortable" size="small" aria-label="下一张" @click="go(1)">
          <Icon name="mdi:chevron-right" size="22" aria-hidden="true" />
        </VBtn>
      </div>
    </template>

    <div v-else class="featured__empty muted-text">暂无特色资源</div>
  </div>
</template>

<style scoped lang="scss">
.featured {
  position: relative;
  overflow: hidden;
  border: 1px solid rgb(var(--v-theme-on-surface) / 0.12);
  border-radius: $radius-lg;
  background: rgb(var(--v-theme-surface));
}
.featured__link {
  display: block;
  position: relative;
  text-decoration: none;
}
.featured__cover {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  animation: featured-fade $transition-normal ease;
}
.featured__caption {
  position: absolute;
  left: 16px;
  bottom: 16px;
  max-width: 80%;
  padding: 6px 14px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  background: rgb(0 0 0 / 0.55);
  border-radius: $radius-sm;
  backdrop-filter: blur(4px);
}
.featured__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 4px 8px 8px;
}
.featured__dots {
  display: flex;
  gap: 6px;
}
.featured__dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgb(var(--v-theme-on-surface) / 0.25);
  cursor: pointer;
  transition: background-color $transition-fast ease;
}
.featured__dot.is-active {
  background: rgb(var(--v-theme-primary));
}
.featured__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
}

@keyframes featured-fade {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .featured__cover {
    animation: none;
  }
}
</style>
