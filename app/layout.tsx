import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import InitializeSettings from "./initialize-settings";

const figtree = Figtree({ subsets: ["latin"] });

let title = "Study Buddy – AI Personal Tutor";
let description = "Learn faster with our open source AI personal tutor";
let url = "https://studybuddy.com/";
let ogimage = "https://studybuddy.com/og-image.png";
let sitename = "studybuddy.com";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-app="study">
      <body
        className={`${figtree.className} flex h-full flex-col justify-between bg-paper text-ink antialiased`}
      >
        <InitializeSettings />
        {children}
      </body>
    </html>
  );
}
