import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThreadN - AI-Powered Viral Facebook Hooks & Threads",
  description:
    "Generate scroll-stopping Facebook hooks and viral threads in seconds with AI. Turn your content into engagement machines.",
  keywords: ["facebook", "threads", "hooks", "viral", "ai", "content", "social media"],
  authors: [{ name: "ThreadN" }],
  openGraph: {
    title: "ThreadN - AI-Powered Viral Facebook Hooks & Threads",
    description:
      "Generate scroll-stopping Facebook hooks and viral threads in seconds with AI.",
    url: "https://threadn.launchory.org",
    siteName: "ThreadN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <div className="animated-bg" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
