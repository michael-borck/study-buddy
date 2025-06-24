import { Logo } from "./logo";

const Header = () => {
  return (
    <div className="container flex h-[60px] shrink-0 items-center justify-between px-4 lg:h-[80px] lg:px-0">
      <a href="/">
        <Logo className="w-30 sm:w-36" />
      </a>
      <a 
        href="/settings" 
        className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
      >
        Settings
      </a>
    </div>
  );
};

export default Header;
