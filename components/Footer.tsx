import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="container flex min-h-[72px] items-center justify-between border-t border-[#D2D2D2] px-4 pb-3 pt-5 lg:min-h-[72px] lg:px-0 lg:py-5">
      <a href="/" className="flex items-center gap-2">
        <span className="text-2xl">🎓</span>
        <span className="text-lg font-bold text-gray-900">Study Buddy</span>
      </a>
      <div className="flex items-center gap-3">
        <Link href={"https://x.com/Michael_Borck"} target="_blank" title="Follow on X">
          <Image
            unoptimized
            src={"/twitter.svg"}
            alt="twitter"
            width={15}
            height={15}
          />
        </Link>
        <Link 
          href={"https://www.linkedin.com/in/michaelborck/"} 
          target="_blank"
          title="Connect on LinkedIn"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </Link>
        <Link 
          href={"https://michaelborck.dev"} 
          target="_blank"
          title="Visit Website"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </Link>
        <Link href={"https://github.com/michael-borck/study-buddy"} target="_blank" title="View on GitHub">
          <Image
            unoptimized
            src={"/github.svg"}
            alt="github"
            width={16}
            height={16}
          />
        </Link>
      </div>
    </div>
  );
};

export default Footer;
