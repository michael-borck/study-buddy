const Header = () => {
  return (
    <div className="container flex h-[60px] shrink-0 items-center justify-between px-4 lg:h-[80px] lg:px-0">
      <a href="/" className="flex items-center gap-2">
        <span className="text-4xl">🎓</span>
        <span className="text-xl font-semibold text-ink">Study Buddy</span>
      </a>
      <nav className="flex items-center space-x-6">
        <a
          href="/docs"
          className="text-ink-muted transition-colors duration-normal hover:text-ink"
          style={{ fontWeight: 500 }}
        >
          Docs
        </a>
        <a
          href="/about"
          className="text-ink-muted transition-colors duration-normal hover:text-ink"
          style={{ fontWeight: 500 }}
        >
          About
        </a>
        <a
          href="/legal"
          className="text-ink-muted transition-colors duration-normal hover:text-ink"
          style={{ fontWeight: 500 }}
        >
          Legal
        </a>
        <a
          href="/settings"
          className="text-ink-muted transition-colors duration-normal hover:text-ink"
          style={{ fontWeight: 500 }}
        >
          Settings
        </a>
      </nav>
    </div>
  );
};

export default Header;
