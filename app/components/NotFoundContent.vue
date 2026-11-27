<script setup lang="ts">
import type { NuxtError } from '#app';

// 404 视图：版式对齐 PidanUI 官网——居中卡片 + 大号 404 + 说明 + 圆角按钮
const props = defineProps<{ error?: NuxtError }>();
</script>

<template>
  <div class="not-found">
    <div class="not-found__card">
      <p class="not-found__code">{{ props.error?.statusCode ?? 404 }}</p>
      <h1 class="not-found__title">页面走丢了</h1>
      <p class="not-found__desc">你访问的页面不存在，或者已经被移动。</p>
      <VBtn to="/" color="primary" size="large" rounded="pill">返回首页</VBtn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  display: flex;
  justify-content: center;
  padding: 10vh 16px 0;
}
.not-found__card {
  width: 100%;
  max-width: 520px;
  padding: 40px 32px;
  text-align: center;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: $radius-lg;
}
.not-found__code {
  margin: 0;
  font-family: $font-code;
  font-size: 64px;
  font-weight: 800;
  line-height: 1;
  color: rgb(var(--v-theme-primary));
}
.not-found__title {
  margin: 12px 0 8px;
  font-size: 22px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}
.not-found__desc {
  margin: 0 0 24px;
  font-size: 15px;
  color: rgba(var(--v-theme-on-surface), 0.7);
}
</style>
