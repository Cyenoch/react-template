import type autoImport from "unplugin-auto-import/vite";

/**
 * 自动导入配置
 * 自动导入常用的 React hooks、UI 组件，无需手动 import
 */
export const autoImportOptions: Parameters<typeof autoImport>[0] = {
  imports: [
    "react", // useState, useEffect, useRef 等

    {
      "@tanstack/react-router": ["Link", "useRouter"],
      "@/components/ui/button": ["Button"],
      "@/components/ui/input": ["Input"],
      "@/components/ui/label": ["Label"],
      "@/components/ui/card": [
        "Card",
        "CardHeader",
        "CardTitle",
        "CardDescription",
        "CardContent",
        "CardFooter",
        "CardAction",
      ],
      "@/components/ui/spinner": ["Spinner"],
      sonner: ["toast"],
    },
  ],

  dts: "src/types/auto-imports.d.ts", // 生成类型定义
  dirs: ["src/hooks"], // 自动扫描 hooks 目录
  include: [/\.[jt]sx?$/, /tsr-split/], // 启用的文件类型
};
