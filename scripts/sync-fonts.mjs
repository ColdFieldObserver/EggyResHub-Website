/**
 * 把 HarmonyOS Sans SC 的分包字体在 `nuxi generate` 之后注入 .output/public/fonts/。
 *
 * 仓库零字体文件（授权与体积双重考虑）；CJK 分包有几百个 woff2，
 * 交给 Vite 会拖慢构建且产物结构不可控，因此构建后单独灌注。
 * 只取 400 / 500 / 600 / 700 四档（Regular / Medium / Semibold / Bold）。
 */
import { createRequire } from 'node:module';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = 'harmonyos-sans-sc-webfont-splitted';
const WEIGHTS = ['Regular', 'Medium', 'Semibold', 'Bold'];

const require = createRequire(import.meta.url);
const distDir = dirname(require.resolve(PKG));
const publicDir = fileURLToPath(new URL('../.output/public', import.meta.url));
const outDir = join(publicDir, 'fonts');

if (!existsSync(publicDir)) {
  console.error('[fonts] 找不到 .output/public，先跑 nuxi generate');
  process.exit(1);
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

let css = '';
let chunks = 0;
for (const weight of WEIGHTS) {
  css += `${readFileSync(join(distDir, `${weight}.css`), 'utf8')}\n`;
  for (const file of readdirSync(distDir)) {
    if (file.startsWith(`${weight}_`) && file.endsWith('.woff2')) {
      copyFileSync(join(distDir, file), join(outDir, file));
      chunks++;
    }
  }
}
writeFileSync(join(outDir, 'harmonyos.css'), css);

console.log(`[fonts] ${WEIGHTS.length} 个字重 / ${chunks} 个 woff2 分片 → .output/public/fonts/`);

// Nitro 在 Cloudflare 环境里可能生成部署重定向，会让 wrangler 找不到 assets 目录。
// 本站是纯静态 SSG，没有 worker 入口，直接清掉。
for (const stale of ['server', '../.wrangler']) {
  const target = join(publicDir, stale);
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
    console.log(`[fonts] 清理多余产物：${stale}`);
  }
}
