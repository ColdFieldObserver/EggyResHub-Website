<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();
</script>

<template>
  <div class="page-shell error-page">
    <p class="error-code">{{ props.error.statusCode ?? 404 }}</p>
    <h1 class="text-h5 font-weight-bold mb-2">页面走丢了</h1>
    <p class="muted-text text-body-2 mb-6">
      {{ props.error.statusMessage || '没有找到你要访问的页面。' }}
    </p>
    <VBtn to="/" color="primary" variant="tonal">
      <Icon name="mdi:home" size="18" class="mr-1" aria-hidden="true" />
      返回首页
    </VBtn>
  </div>
</template>

<style scoped lang="scss">
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}
.error-code {
  font-family: $font-code;
  font-size: 4rem;
  font-weight: 700;
  color: rgba(var(--v-theme-primary), 0.5);
  line-height: 1;
}
</style>
