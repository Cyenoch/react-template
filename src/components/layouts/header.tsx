import { Link, useRouteContext } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { setTheme } from '@/lib/utils/theme';

export function Header() {
  const router = useRouter();
  const { theme } = useRouteContext({ from: '__root__' });

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    router.invalidate();
  }, [theme, router]);

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-bold text-xl">
          React Template
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/" className="[&.active]:font-medium">
            Home
          </Link>
          <Link to="/user" className="[&.active]:font-medium">
            User
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
        </div>
      </div>
    </header>
  );
}
