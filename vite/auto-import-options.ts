import type autoImport from "unplugin-auto-import/vite";

export const autoImportOptions: Parameters<typeof autoImport>[0] = {
  imports: [
    "react",
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
  dts: "src/types/auto-imports.d.ts",
  dirs: ["src/hooks"],
  include: [/\.[jt]sx?$/, /tsr-split/],
};
