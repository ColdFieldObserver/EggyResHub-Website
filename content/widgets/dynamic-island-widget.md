---
title: 蛋仔灵动岛桌面挂件
date: 2026-11-22 10:00:00
categories: [桌面组件, 桌面美化]
tags: [蛋仔派对, Windows, 开源, Rainmeter]
description: 一个运行在 Windows 桌面的「灵动岛」风格状态挂件，可显示硬件状态与轮播图。
stickypost: true
cover: /images/default-cover.webp
---

# 蛋仔灵动岛桌面挂件

把硬件监控、时钟与轮播图收进一条胶囊里，常驻桌面顶部。

## 功能

- CPU / 内存 / 磁盘 / 电池 / 网速实时监控
- 轮播图从外部目录动态读取，不打包进程序
- 三态主题：跟随系统 / 浅色 / 深色
- 一键生成错误报告，方便反馈问题

## 配置示例

```json
{
  "theme": "auto",
  "photos": true,
  "refresh_interval": 2
}
```

### 目录约定

轮播图放在程序旁的 `carousel/` 文件夹：

<details>
<summary>展开查看目录结构</summary>

```text
程序目录/
├─ 灵动岛.exe
└─ carousel/
   ├─ 01.png
   └─ 02.png
```

</details>

数学公式渲染示例：$E = mc^2$，行间公式：

$$
a^2 + b^2 = c^2
$$

站外链接示例：[Nuxt 官网](https://nuxt.com) 会在新标签页打开。

| 项目 | 值 |
| --- | --- |
| 平台 | Windows |
| 语言 | Python |
| 许可 | AGPL-3.0 |
