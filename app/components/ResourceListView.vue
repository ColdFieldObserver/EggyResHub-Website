<script setup lang="ts">
import { computed } from 'vue';
import { useAllResources, usePagedResources } from '~/composables/useResources';
import type { Resource } from '#shared/types/resource';

// 复用同一套卡片机制：全部资源 / 分类 / 标签 / 分区 / 搜索结果都走这里。
const props = withDefaults(
  defineProps<{
    title: string;
    summary?: string;
    source: () => Resource[];
    page?: number;
    basePath?: string;
  }>(),
  { page: 1, basePath: '/resources' },
);

const all = useAllResources();
void all; // 数据由 layout 预取，这里只消费传入的 source

const { totalPages, page, pageResources } = usePagedResources(
  () => props.page,
  () => props.source(),
);

/** 分页链接：第 1 页回 basePath，其余 /basePath/page/n */
function pageHref(n: number): string {
  const base = props.basePath.replace(/\/$/, '');
  return n <= 1 ? `${base}/` : `${base}/page/${n}`;
}
const showPager = computed(() => totalPages.value > 1);
</script>

<template>
  <div class="page-shell">
    <header class="reveal-item">
      <h1 class="text-h4 font-weight-bold mb-1">{{ props.title }}</h1>
      <p v-if="props.summary" class="muted-text text-body-2">
        {{ props.summary }} · 共 {{ props.source().length }} 个资源 · 第 {{ page }} /
        {{ totalPages }} 页
      </p>
    </header>

    <div v-if="pageResources.length" class="card-grid mt-6 reveal-item">
      <ResourceCard v-for="resource in pageResources" :key="resource.path" :resource="resource" />
    </div>
    <p v-else class="muted-text mt-6">暂无资源。</p>

    <div v-if="showPager" class="d-flex justify-center mt-8">
      <VPagination
        :model-value="page"
        :length="totalPages"
        :total-visible="5"
        rounded="circle"
        @update:model-value="navigateTo(pageHref($event))"
      />
    </div>

    <!-- 底部插槽：全部资源页在此放 Giscus 评论区 -->
    <slot name="footer" />
  </div>
</template>
