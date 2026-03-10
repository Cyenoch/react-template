import React from "react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="font-medium">React Template</p>
          <p className="text-sm text-muted-foreground">
            为产品首页、后台原型和实验项目准备的现代化起点。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>TanStack Start</span>
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <span>shadcn/ui</span>
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <span>Zustand</span>
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <span>2026</span>
        </div>
      </div>
    </footer>
  );
}
