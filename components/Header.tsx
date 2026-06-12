import Link from "next/link";
import packageJson from "../package.json";

const Header = () => {
  return (
    <div className="container flex h-[60px] shrink-0 items-center justify-between px-4 lg:h-[80px] lg:px-0">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-4xl">🎓</span>
        <span className="text-xl font-semibold text-ink">Study Buddy</span>
        <span className="text-xs text-ink-quiet">v{packageJson.version}</span>
      </Link>
      <nav className="flex items-center space-x-6">
        <Link
          href="/docs"
          className="text-ink-muted transition-colors duration-normal hover:text-ink"
          style={{ fontWeight: 500 }}
        >
          Docs
        </Link>
        <Link
          href="/about"
          className="text-ink-muted transition-colors duration-normal hover:text-ink"
          style={{ fontWeight: 500 }}
        >
          About
        </Link>
        <Link
          href="/settings"
          className="text-ink-muted transition-colors duration-normal hover:text-ink"
          style={{ fontWeight: 500 }}
        >
          Settings
        </Link>
      </nav>
    </div>
  );
};

export default Header;
