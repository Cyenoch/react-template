import { createFileRoute } from "@tanstack/react-router";
import {
  CheckmarkCircle02Icon,
  CodeIcon,
  CommandLineIcon,
  DashboardSquare02Icon,
  Layout03Icon,
  LaptopProgrammingIcon,
  Rocket01Icon,
  SparklesIcon,
  StarsIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const highlights = [
  {
    title: "首页结构",
    description: "包含标题、简介、按钮和说明区块。",
    icon: Layout03Icon,
  },
  {
    title: "主题切换",
    description: "顶部可切换 system、light、dark。",
    icon: SparklesIcon,
  },
  {
    title: "继续扩展",
    description: "后面接业务区块、导航或其他页面都比较直接。",
    icon: Rocket01Icon,
  },
] as const;

const stackCards = [
  {
    label: "UI Layer",
    value: "shadcn/ui",
    note: "组件可继续扩展",
  },
  {
    label: "App Core",
    value: "TanStack Start",
    note: "路由与 SSR 结构完整",
  },
  {
    label: "State",
    value: "Zustand",
    note: "主题与会话都可托管",
  },
] as const;

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const scrollTo = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-136"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, color-mix(in oklab, var(--accent) 65%, transparent), transparent 34%), radial-gradient(circle at top right, color-mix(in oklab, var(--primary) 22%, transparent), transparent 28%)",
        }}
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pb-24 lg:pt-16">
        <div className="space-y-8">
          <div className="space-y-5">
            <Badge
              variant="outline"
              className="rounded-full border-border/70 bg-background/70 px-3 py-1 uppercase tracking-[0.24em]"
            >
              首页模板
            </Badge>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl">
                一个简洁的 React 首页模板
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                内置主题切换、说明卡片和快速开始区域，适合作为新项目的默认首页。
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="rounded-full px-5" onClick={() => scrollTo("quick-start")}>
              <HugeiconsIcon icon={Rocket01Icon} strokeWidth={2} data-icon="inline-start" />
              快速开始
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-5"
              onClick={() => scrollTo("highlights")}
            >
              <HugeiconsIcon icon={StarsIcon} strokeWidth={2} data-icon="inline-start" />
              查看内容
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {stackCards.map((item) => (
              <Card
                key={item.label}
                size="sm"
                className="border-border/70 bg-background/75 shadow-lg shadow-black/5 backdrop-blur dark:shadow-black/20"
              >
                <CardHeader className="gap-2">
                  <CardDescription className="text-[0.72rem] uppercase tracking-[0.22em]">
                    {item.label}
                  </CardDescription>
                  <CardTitle className="text-lg">{item.value}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-muted-foreground">
                  {item.note}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 rotate-3 rounded-4xl blur-2xl"
            style={{
              backgroundImage:
                "linear-gradient(135deg, color-mix(in oklab, var(--accent) 24%, transparent), transparent 50%), linear-gradient(180deg, color-mix(in oklab, var(--primary) 14%, transparent), transparent 80%)",
            }}
          />

          <Card className="border-border/70 bg-background/80 shadow-2xl shadow-black/10 backdrop-blur-xl dark:shadow-black/30">
            <CardHeader className="gap-4 border-b border-border/70 pb-6">
              <div className="flex items-center justify-between gap-4">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  结构预览
                </Badge>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  支持主题切换
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">首页结构示例</CardTitle>
                <CardDescription className="max-w-xl text-sm leading-6">
                  这里放标题、简介、说明区块和启动信息。后续直接替换成你的内容即可。
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <Tabs defaultValue="intro" className="gap-5">
                <TabsList variant="line" className="h-auto w-full flex-wrap justify-start gap-1">
                  <TabsTrigger value="intro">首页</TabsTrigger>
                  <TabsTrigger value="system">主题</TabsTrigger>
                  <TabsTrigger value="workflow">开始</TabsTrigger>
                </TabsList>

                <TabsContent value="intro" className="space-y-4">
                  <PreviewItem
                    icon={DashboardSquare02Icon}
                    title="标题与简介"
                    description="放基础介绍和操作按钮。"
                  />
                  <PreviewItem
                    icon={Layout03Icon}
                    title="说明卡片"
                    description="可用来放特性、模块或页面说明。"
                  />
                </TabsContent>

                <TabsContent value="system" className="space-y-4">
                  <PreviewItem
                    icon={SparklesIcon}
                    title="主题切换"
                    description="支持 system、light、dark 三种模式。"
                  />
                  <PreviewItem
                    icon={CheckmarkCircle02Icon}
                    title="全局 token"
                    description="颜色、圆角和背景都来自同一套变量。"
                  />
                </TabsContent>

                <TabsContent value="workflow" className="space-y-4">
                  <PreviewItem
                    icon={LaptopProgrammingIcon}
                    title="组件复用"
                    description="首页使用现有的 Button、Card、Tabs 等组件。"
                  />
                  <PreviewItem
                    icon={CommandLineIcon}
                    title="快速开始"
                    description="保留下方常用命令，方便继续开发。"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="highlights" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">模板内容</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              页面里现在包含这些基础部分
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            保持简单，方便你后续直接替换。
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {highlights.map((item) => (
            <Card
              key={item.title}
              className="border-border/70 bg-card/80 shadow-lg shadow-black/5 backdrop-blur dark:shadow-black/20"
            >
              <CardHeader className="space-y-4">
                <div className="flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-muted/80">
                  <HugeiconsIcon icon={item.icon} strokeWidth={2} className="size-5" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="leading-6">{item.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="quick-start" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <Card className="border-border/70 bg-card/80 shadow-2xl shadow-black/10 backdrop-blur-xl dark:shadow-black/30">
          <CardHeader className="gap-3 border-b border-border/70 pb-6">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={CodeIcon} strokeWidth={2} className="size-5 text-primary" />
              <CardTitle className="text-2xl">快速开始</CardTitle>
            </div>
            <CardDescription className="max-w-2xl leading-6">
              如果只是把这个模板当项目起点，先保留这几个区域就够用了。
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6 pt-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-4">
              <QuickStep title="修改标题与简介" description="先换成项目名称和一句话介绍。" />
              <QuickStep title="替换说明卡片" description="把这里改成你的功能、模块或页面入口。" />
              <QuickStep title="继续补页面" description="后面再接登录、列表、后台或文档页面。" />
            </div>

            <div className="rounded-[1.75rem] border border-border/70 bg-background/75 p-5 shadow-inner shadow-black/5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">建议起手命令</p>
                  <p className="text-sm text-muted-foreground">先跑起来，再按模块继续改。</p>
                </div>
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </div>

              <div className="space-y-3 rounded-2xl border border-border/70 bg-card px-4 py-4 font-mono text-sm">
                <CommandLine line="bun install" label="安装依赖" />
                <Separator />
                <CommandLine line="bun run dev" label="启动开发环境" />
                <Separator />
                <CommandLine line="bun run typecheck" label="提交前校验" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function PreviewItem({
  icon,
  title,
  description,
}: {
  icon: typeof SparklesIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border/70 bg-muted/35 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-background">
        <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function QuickStep({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
      <p className="mb-1 font-medium">{title}</p>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function CommandLine({ line, label }: { line: string; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
        <p className="mt-1 truncate text-sm text-foreground">{line}</p>
      </div>
      <HugeiconsIcon
        icon={CommandLineIcon}
        strokeWidth={2}
        className="size-4 shrink-0 text-muted-foreground"
      />
    </div>
  );
}
