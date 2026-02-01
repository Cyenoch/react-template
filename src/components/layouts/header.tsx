import { useRouteContext } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { setTheme } from "@/core/utils";

export function Header() {
  const router = useRouter();
  const { theme } = useRouteContext({ from: "__root__" });

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
    router.invalidate();
  }, [theme, router]);

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <span className="font-bold text-xl">React Template</span>
        <Button variant="outline" size="sm" onClick={toggleTheme}>
          {theme === "dark" ? "Light" : "Dark"}
        </Button>
      </div>
    </header>
  );
}
