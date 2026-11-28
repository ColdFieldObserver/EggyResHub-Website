<script setup lang="ts">
// 「关于」对话框：简介、技术栈、联系方式、版权声明、开源声明。
import { ref } from 'vue';
import { ABOUT_INTRO, ABOUT_ITEMS } from '~/data/about';
import { SITE } from '#shared/site';

const open = ref(false);
defineExpose({ open: () => (open.value = true) });
</script>

<template>
  <VDialog v-model="open" max-width="560" scrollable>
    <VCard rounded="lg">
      <VCardTitle class="about-dialog-title">
        <span class="about-dialog-title-text">关于{{ SITE.brand }}</span>
        <VBtn icon variant="text" density="comfortable" aria-label="关闭" @click="open = false">
          <Icon name="mdi:close" size="20" aria-hidden="true" />
        </VBtn>
      </VCardTitle>
      <VCardText class="about-dialog-content">
        <p class="about-intro">{{ ABOUT_INTRO }}</p>
        <div v-for="item in ABOUT_ITEMS">
          <h3 class="about-h">{{ item.title }}</h3>
          <p v-if="typeof item.content === 'string'" class="about-copy">{{ item.content }}</p>
          <ul v-if="Array.isArray(item.content)" class="about-list">
            <li v-for="text in item.content">{{ text }}</li>
          </ul>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped lang="scss">
.about-dialog-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 8px;
}
.about-dialog-title-text {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.6;
}
.about-dialog-content {
  padding: 20px;
  padding-top: 0;
}
.about-intro {
  margin: 0 0 20px;
  font-size: 1rem;
  line-height: 1.5;
}
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
.about-copy {
  margin: 0 0 16px;
  font-size: 0.875rem;
  line-height: 1.5;
}
.about-copy-last {
  margin-bottom: 0;
}
</style>
