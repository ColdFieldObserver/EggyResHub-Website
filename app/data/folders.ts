// 分类页三层结构的第一层：content/<folder>/ 的展示信息。
// folder 由内容文件路径推导（见 shared/utils/content.ts），这里只补展示用的中文名与图标。
// 未登记的文件夹会回退为「文件夹原名 + 通用文件夹图标」，新增目录不必改这里也能显示。

export interface FolderMeta {
  label: string;
  icon: string;
  description?: string;
}

export const FOLDER_META: Record<string, FolderMeta> = {
  widgets: {
    label: '桌面组件',
    icon: 'mdi:widgets-outline',
    description: '时钟、动态岛等桌面挂件',
  },
  wallpapers: {
    label: '壁纸',
    icon: 'mdi:image-outline',
    description: '蛋仔风格桌面壁纸',
  },
  tools: {
    label: '实用工具',
    icon: 'mdi:tools',
    description: '配色、裁剪等小工具',
  },
  tutorials: {
    label: '使用教程',
    icon: 'mdi:book-open-variant',
    description: '安装与上手指南',
  },
};

/** 文件夹展示名（未登记的目录回退为原名） */
export function folderLabel(folder: string): string {
  return FOLDER_META[folder]?.label ?? folder;
}

/** 文件夹图标（未登记的目录回退为通用文件夹图标） */
export function folderIcon(folder: string): string {
  return FOLDER_META[folder]?.icon ?? 'mdi:folder-outline';
}

/** 文件夹描述（可选） */
export function folderDescription(folder: string): string {
  return FOLDER_META[folder]?.description ?? '';
}
