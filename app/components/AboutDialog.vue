<script setup lang="ts">
// 「关于」对话框：简介、技术栈、联系方式、版权声明、开源声明。
import { ref } from 'vue';
import { ABOUT } from '~/data/about';
import { SITE } from '#shared/site';

const open = ref(false);
defineExpose({ open: () => (open.value = true) });
</script>

<template>
  <VDialog v-model="open" max-width="560" scrollable>
    <VCard rounded="lg">
      <VCardTitle class="d-flex align-center justify-space-between pa-5 pb-2">
        <span class="text-h6">关于{{ SITE.brand }}</span>
        <VBtn icon variant="text" density="comfortable" aria-label="关闭" @click="open = false">
          <Icon name="mdi:close" size="20" aria-hidden="true" />
        </VBtn>
      </VCardTitle>
      <VCardText class="px-5 pb-5">
        <p class="text-body-1 mb-5">{{ ABOUT.intro }}</p>

        <h3 class="about-h">技术栈</h3>
        <ul class="about-list">
          <li v-for="item in ABOUT.stack" :key="item">{{ item }}</li>
        </ul>

        <h3 class="about-h">联系方式</h3>
        <p class="text-body-2 mb-4">{{ ABOUT.contact }}</p>

        <h3 class="about-h">版权声明</h3>
        <p class="text-body-2 mb-4">{{ ABOUT.copyright }}</p>

        <h3 class="about-h">开源声明</h3>
        <p class="text-body-2">{{ ABOUT.opensource }}</p>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">
.about-h {
  margin: 18px 0 8px;
  font-size: 0.98rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}
.about-list {
  margin: 0 0 4px 1.2em;
  list-style: disc;
  font-size: 0.875rem;
  line-height: 1.9;
}
</style>
