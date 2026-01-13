import type autoImport from "unplugin-auto-import/vite";

export const autoImportOptions: Parameters<typeof autoImport>[0] = {
  imports: [
    "react",
    {
      "@tanstack/react-router": ["Link", "useRouter"],
      "@workspace/ui": [
        "Button",
        "Input",
        "Label",
        "Card",
        "CardHeader",
        "CardTitle",
        "CardDescription",
        "CardContent",
        "CardFooter",
        "CardAction",
        "Spinner",
      ],
      sonner: ["toast"],
    },
  ],
  dts: "src/types/auto-imports.d.ts",
  dirs: ["src/hooks"],
  include: [/\.[jt]sx?$/, /tsr-split/],
};
