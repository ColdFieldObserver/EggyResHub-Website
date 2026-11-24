<script setup lang="ts">
// 覆盖默认 ProseLi：保持纯净 <li>，样式由 prose.scss 接管。
// class（如任务列表的 task-list-item）仍随 Vue 透传属性落到根元素上。
</script>

<template>
  <li>
    <slot />
  </li>
</template>
