import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Closer Gym — the gym for closers",
  description:
    "Sparring against fifteen adversarial buyer bots. Eval bar per move, Atlas-tagged blunder markers, Glicko-2 closing ELO. What chess.com did to chess, for sales.",
};

const TABS = [
  { label: "Play",     href: "/play",     icon: "▶" },
  { label: "Puzzles",  href: "/puzzles",  icon: "◇" },
  { label: "Lessons",  href: "/lessons",  icon: "▤" },
  { label: "Watch",    href: "/watch",    icon: "◉" },
  { label: "Analysis", href: "/analysis", icon: "∿" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} antialiased`}>
      <body>
        <header className="topnav">
          <div className="h-full flex items-center px-4 gap-1">
            <Link href="/" className="flex items-center gap-2 mr-6 pr-4" style={{ borderRight: "1px solid var(--border)" }}>
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  background: "var(--brand-green-600)",
                  color: "var(--bg-page)",
                  fontWeight: 800,
                  fontSize: 16,
                  letterSpacing: "-0.02em",
                }}
              >
                ♛
              </span>
              <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em" }}>
                closer<span style={{ color: "var(--brand-green-600)" }}>.gym</span>
              </span>
            </Link>

            <nav className="flex items-center h-full">
              {TABS.map((tab) => (
                <Link key={tab.href} href={tab.href} className="topnav-link">
                  {tab.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <Link href="/about" className="btn btn-ghost" style={{ height: 36 }}>
                About
              </Link>
              <Link href="/play" className="btn btn-primary" style={{ height: 36 }}>
                Play Now
              </Link>
            </div>
          </div>
        </header>

        <div className="flex" style={{ minHeight: "calc(100vh - 56px)" }}>
          <aside className="sidebar">
            <Link href="/" className="sidebar-item" aria-label="Home" title="Home">
              <span aria-hidden style={{ fontSize: 18 }}>⌂</span>
            </Link>
            {TABS.map((tab) => (
              <Link key={tab.href} href={tab.href} className="sidebar-item" aria-label={tab.label} title={tab.label}>
                <span aria-hidden style={{ fontSize: 18 }}>{tab.icon}</span>
              </Link>
            ))}
            <div style={{ flex: 1 }} />
            <Link href="/about" className="sidebar-item" aria-label="About" title="About">
              <span aria-hidden style={{ fontSize: 18 }}>?</span>
            </Link>
          </aside>

          <main style={{ flex: 1, minWidth: 0 }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
