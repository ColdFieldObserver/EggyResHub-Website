<script setup lang="ts">
// 标题文本保持纯文本，末尾追加独立 .header-anchor 图标链接，
// 由 prose.scss 控制 hover 时淡入（renderer.anchorLinks 已关闭）。
const props = defineProps<{ id?: string }>();
</script>

<template>
  <h2 :id="props.id">
    <slot />
    <a
      v-if="props.id"
      class="header-anchor"
      :href="`#${props.id}`"
      aria-hidden="true"
      tabindex="-1"
    />
  </h2>
</template>
