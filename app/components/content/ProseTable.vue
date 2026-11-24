<script setup lang="ts">
// 覆盖默认 ProseTable：用中性的 .table-scroll 包裹，
// <table> 保持干净语义标签（display:table，不破坏行列语义）。
// 横向溢出交给外层滚动容器，样式在 prose.scss 里。
</script>

<template>
  <div class="table-scroll">
    <table>
      <slot />
    </table>
  </div>
</template>
