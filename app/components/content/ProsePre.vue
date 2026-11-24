<script setup lang="ts">
// ============================================================
// 自定义 ProsePre：代码块顶部信息栏 + 复制按钮
//   <div class="code-block language-x">
//     <div class="code-head"><span class="lang">x</span><button class="copy" /></div>
//     <pre class="shiki">…</pre>
//   </div>
// 保留 .copy 与 div[class*="language-"] 外层，复制逻辑按这两个契约名定位。
// ============================================================
const props = defineProps<{
  code?: string;
  language?: string | null;
  filename?: string | null;
  highlights?: number[];
  meta?: string | null;
  class?: string | null;
}>();

/** text / plaintext 视为「无语言」：信息栏只留复制按钮 */
const lang = computed(() => {
  const value = props.language ?? '';
  return value === 'text' || value === 'plaintext' ? '' : value;
});

const langLabel = computed(() => {
  if (!lang.value) return '';
  const alias: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    md: 'markdown',
    sh: 'shell',
    yml: 'yaml',
  };
  return (alias[lang.value] ?? lang.value).toUpperCase();
});

const copied = ref(false);
async function onCopy(event: MouseEvent): Promise<void> {
  const btn = event.currentTarget as HTMLElement | null;
  const host = btn?.closest<HTMLElement>('div[class*="language-"]');
  const text = host?.querySelector('pre code')?.textContent ?? props.code ?? '';
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    window.setTimeout(() => (copied.value = false), 1600);
  } catch {
    // 剪贴板不可用（http / 无权限）时静默失败
  }
}
</script>

<template>
  <div :class="['code-block', `language-${lang || 'text'}`]">
    <div class="code-head">
      <span class="lang">{{ langLabel }}</span>
      <button
        class="copy"
        :class="{ copied }"
        type="button"
        title="复制代码"
        aria-label="复制代码"
        @click="(e) => onCopy(e)"
      />
    </div>
    <pre :class="props.class"><slot /></pre>
  </div>
</template>
