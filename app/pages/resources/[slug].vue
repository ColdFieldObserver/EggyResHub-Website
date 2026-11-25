<script setup lang="ts">
// 资源详情页：正文由 @nuxt/content 的 <ContentRenderer> 渲染。
// 数据来自构建期预渲染的单篇静态 JSON（含 body AST），组件里不直接查内容库。
import { toArray } from '#shared/utils/content';
import { formatDisplayDate } from '#shared/utils/date';
import { fetchResources, useAllResources } from '~/composables/useResources';

await fetchResources();

const route = useRoute();
const posts = useAllResources();
const requestFetch = useRequestFetch();

const { data: doc } = await useAsyncData(`resource:${route.path}`, () =>
  requestFetch<Record<string, unknown>>(`/api/resources/${route.params.slug}/index.json`),
);

if (!doc.value) {
  throw createError({ statusCode: 404, message: '资源不存在', fatal: true });
}

const meta = computed(() => doc.value ?? {});
const title = computed(() => String(meta.value.title ?? ''));
const displayDate = computed(() => formatDisplayDate(meta.value.date));
const categories = computed(() => toArray(meta.value.categories));
const tags = computed(() => toArray(meta.value.tags));

// 上下篇（按列表顺序）
const index = computed(() => posts.value.findIndex((post) => post.path === route.path));
const prev = computed(() => (index.value > 0 ? posts.value[index.value - 1] : undefined));
const next = computed(() =>
  index.value >= 0 && index.value < posts.value.length - 1
    ? posts.value[index.value + 1]
    : undefined,
);

useSeoMeta({
  title: () => title.value,
  description: () => String(meta.value.description ?? ''),
});
</script>

<template>
  <div class="page-shell post-view">
    <header class="post-header reveal-item">
      <h1 class="post-title">{{ title }}</h1>
      <div class="post-meta">
        <span>
          <Icon name="mdi:calendar-blank" size="14" aria-hidden="true" />
          {{ displayDate }}
        </span>
        <NuxtLink
          v-for="cat in categories"
          :key="cat"
          :to="`/categories/${encodeURIComponent(cat)}`"
          class="tag"
        >
          {{ cat }}
        </NuxtLink>
      </div>
      <div v-if="tags.length" class="post-tags">
        <NuxtLink
          v-for="tag in tags"
          :key="tag"
          :to="`/tags/${encodeURIComponent(tag)}`"
          class="post-tag"
        >
          #{{ tag }}
        </NuxtLink>
      </div>
    </header>

    <article class="post-content reveal-item">
      <ContentRenderer v-if="doc" :value="doc as never" />
    </article>

    <nav class="post-nav reveal-item">
      <NuxtLink v-if="prev" :to="prev.path" class="post-nav__item">
        <Icon name="mdi:chevron-left" size="18" aria-hidden="true" />
        <span>{{ prev.title }}</span>
      </NuxtLink>
      <span v-else />
      <NuxtLink v-if="next" :to="next.path" class="post-nav__item post-nav__item--next">
        <span>{{ next.title }}</span>
        <Icon name="mdi:chevron-right" size="18" aria-hidden="true" />
      </NuxtLink>
    </nav>

    <GiscusComments />
  </div>
</template>

<style scoped lang="scss">
.post-title {
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 700;
  line-height: 1.3;
  color: rgb(var(--v-theme-on-surface));
}
.post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin: 14px 0 10px;
  font-size: 0.82rem;
  color: rgba(var(--v-theme-on-surface), 0.6);

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
}
.post-meta .tag {
  padding: 2px 10px;
  font-size: 0.78rem;
  text-decoration: none;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.12);
  border-radius: 999px;
}
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}
.post-tag {
  font-size: 0.8rem;
  text-decoration: none;
  color: rgba(var(--v-theme-on-surface), 0.6);
  &:hover {
    color: rgb(var(--v-theme-primary));
  }
}
.post-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 36px;
  padding-top: 20px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}
.post-nav__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 46%;
  font-size: 0.88rem;
  text-decoration: none;
  color: rgba(var(--v-theme-on-surface), 0.75);
  &:hover {
    color: rgb(var(--v-theme-primary));
  }
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.post-nav__item--next {
  text-align: right;
}
</style>
