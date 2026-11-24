import { listSections } from '../../../build/content-index';

// 分区信息（来自 content/<section>/.categorynav.yml）。
// 分区元信息不是 content 文档，由构建期 fs 扫描生成，这里输出成静态 JSON 供侧栏与分区页读取。
export default defineEventHandler(() => listSections());
