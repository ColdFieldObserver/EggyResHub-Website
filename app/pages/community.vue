<script setup lang="ts">
import { COMMUNITIES } from '~/data/communities';
</script>

<template>
  <div class="page-shell">
    <header class="reveal-item">
      <h1 class="text-h4 font-weight-bold mb-1">社区推广</h1>
      <p class="muted-text text-body-2">各类数码科技与蛋仔爱好者社区</p>
    </header>

    <div class="link-grid mt-6 reveal-item">
      <LinkCard v-for="item in COMMUNITIES" :key="item.href" :item="item" />
    </div>
  </div>
</template>
