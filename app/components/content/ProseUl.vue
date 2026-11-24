<script setup lang="ts">
// 覆盖默认 ProseUl：保持干净的 <ul>，列表样式交 prose.scss 的元素选择器。
// 属性（如任务列表的 contains-task-list）仍走 Vue 透传。
</script>

<template>
  <ul>
    <slot />
  </ul>
</template>
