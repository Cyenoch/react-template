import { startTransition } from "react";
import { AiLaptopIcon, ArrowDown01Icon, Moon01Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ThemeSchema, type Theme, cn } from "@/core/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSetThemeState, useThemeState } from "@/store";

const themeOptions = [
  {
    label: "跟随系统",
    value: "system",
    description: "自动匹配设备外观",
    icon: AiLaptopIcon,
  },
  {
    label: "浅色",
    value: "light",
    description: "适合白天和演示场景",
    icon: Sun03Icon,
  },
  {
    label: "深色",
    value: "dark",
    description: "适合长时间编码阅读",
    icon: Moon01Icon,
  },
] as const satisfies ReadonlyArray<{
  label: string;
  value: Theme;
  description: string;
  icon: typeof Sun03Icon;
}>;

export function Header() {
  const theme = useThemeState();
  const setTheme = useSetThemeState();
  const currentTheme = themeOptions.find((item) => item.value === theme) ?? themeOptions[0];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-card shadow-lg shadow-black/5 dark:shadow-black/20">
            <span className="font-semibold tracking-[0.18em] text-sm">RT</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold sm:text-lg">React Template</span>
              <Badge variant="outline" className="hidden rounded-full px-2.5 sm:inline-flex">
                Starter
              </Badge>
            </div>
            <p className="hidden text-sm text-muted-foreground sm:block">
              TanStack Start · shadcn/ui · Zustand
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "ring-foreground/10 bg-background hover:bg-muted inline-flex h-10 items-center gap-2 rounded-full border px-3 text-sm font-medium shadow-sm outline-none transition-colors",
              )}
            >
              <HugeiconsIcon icon={currentTheme.icon} strokeWidth={2} className="size-4" />
              <span className="hidden sm:inline">{currentTheme.label}</span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                strokeWidth={2}
                className="size-4 text-muted-foreground"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>主题切换</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => {
                  startTransition(() => {
                    setTheme(ThemeSchema.parse(value));
                  });
                }}
              >
                {themeOptions.map((item) => (
                  <DropdownMenuRadioItem
                    key={item.value}
                    value={item.value}
                    className="flex items-start gap-3 py-2"
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      strokeWidth={2}
                      className="mt-0.5 size-4 text-muted-foreground"
                    />
                    <span className="space-y-0.5">
                      <span className="block font-medium text-foreground">{item.label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
