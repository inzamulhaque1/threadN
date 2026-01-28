import type { Metadata } from "next";
import { Space_Grotesk, Inter, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

// Heading font - Bold, modern, techy
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

// Body font - Clean, readable
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Accent font - Friendly, for descriptions
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
});

// Mono font - For numbers, stats, code
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ThreadN - AI-Powered Viral Facebook Hooks & Threads",
  description:
    "Generate scroll-stopping Facebook hooks and viral threads in seconds with AI. Turn your content into engagement machines.",
  keywords: ["facebook", "threads", "hooks", "viral", "ai", "content", "social media"],
  authors: [{ name: "ThreadN" }],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "ThreadN - AI-Powered Viral Facebook Hooks & Threads",
    description:
      "Generate scroll-stopping Facebook hooks and viral threads in seconds with AI.",
    url: "https://threadn.launchory.org",
    siteName: "ThreadN",
    type: "website",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-body">
        <Providers>
          <div className="animated-bg" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
