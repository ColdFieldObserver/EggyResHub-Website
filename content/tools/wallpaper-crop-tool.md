---
title: 蛋仔壁纸批量裁剪工具
date: 2026-11-08 16:45:00
categories: [实用工具]
tags: [工具, 壁纸, 开源]
description: 把任意比例的原图批量居中裁剪成 16:9 壁纸并输出 PNG。
stickypost: true
cover: /images/default-cover.webp
---

# 蛋仔壁纸批量裁剪工具

一个命令行小工具，用于把杂乱的原图统一裁成壁纸尺寸。

## 用法

```powershell
python crop.py --input ./raw --output ./out --ratio 16:9
```

## 参数

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `--input` | 输入目录 | `./raw` |
| `--output` | 输出目录 | `./out` |
| `--ratio` | 目标比例 | `16:9` |

序号从已有文件往后排，不会覆盖旧图。
