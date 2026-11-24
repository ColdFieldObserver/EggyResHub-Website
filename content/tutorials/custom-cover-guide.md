---
title: 自定义资源封面规范
date: 2026-11-10 11:00:00
categories: [教程]
tags: [封面, 二创, 新手向]
description: 说明资源封面的推荐尺寸、格式，以及缺省时的退化行为。
stickypost: false
cover: /images/default-cover.webp
---

# 自定义资源封面规范

## 推荐规格

- 比例 16:9
- 宽不小于 1200px
- 格式 PNG / WEBP

## 缺省行为

frontmatter 未定义 `cover` 时，卡片自动使用站点默认封面图。

```yaml
---
title: 示例资源
cover: # 留空即用默认封面
---
```

删除线示例：~~旧版尺寸规范已废弃~~，高亮示例：==请用新规范==。
