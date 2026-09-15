import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavBar } from "@/components/nav-bar";
import { auth } from "@/auth";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevOpsPulse — Stay Current with Cloud Native & DevOps",
  description:
    "Your personal DevOps news dashboard. Automatically curated content from CNCF, Azure, Kubernetes, and more.",
  keywords: [
    "DevOps",
    "Cloud Native",
    "Kubernetes",
    "Azure",
    "CNCF",
    "news aggregator",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider delay={300}>
          <NavBar user={session?.user} />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border/30 py-6">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <p className="text-center text-xs text-muted-foreground">
                DevOpsPulse — Auto-curated DevOps & Cloud Native news.
                dcam@2026.
              </p>
            </div>
          </footer>
        </TooltipProvider>
      </body>
    </html>
  );
}
