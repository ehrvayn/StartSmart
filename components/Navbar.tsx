import ThemeToggle from "./ThemeToggle";

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <a
          href="/"
          aria-label="StartSmart home"
          className="flex items-center gap-2.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/StartSmartLogo.png" alt="" className="h-8 w-8" />
          <span className="text-[15px] font-bold tracking-tight">
            StartSmart
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          <a
            href="/#what-you-get"
            className="text-sm text-muted transition-colors hover:text-ink"
          >
            What you get
          </a>
          <a
            href="/#how-it-works"
            className="text-sm text-muted transition-colors hover:text-ink"
          >
            How it works
          </a>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}

export default Navbar;
