<script setup lang="ts">
import { FRIEND_LINKS } from '~/data/links';
</script>

<template>
  <div class="page-shell">
    <header class="reveal-item">
      <h1 class="text-h4 font-weight-bold mb-1">友情链接</h1>
      <p class="muted-text text-body-2">内容目前从 PidanUI 官网复制，后续按需调整</p>
    </header>

    <div class="link-grid mt-6 reveal-item">
      <LinkCard v-for="item in FRIEND_LINKS" :key="item.href" :item="item" />
    </div>
  </div>
</template>
