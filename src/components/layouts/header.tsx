export function Header() {
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
          <Button variant="outline" size="sm">
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
