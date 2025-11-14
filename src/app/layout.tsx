import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creative Templates App",
  description: "Create and manage creative templates with AI-powered tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          {/* Top Navigation Bar */}
          <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container">
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  Creative Templates App
                </Link>
                <div className="flex items-center gap-6">
                  <Link
                    href="/templates"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Templates
                  </Link>
                  <Link
                    href="/designs"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Designs
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
            <div className="container">
              <p className="text-center text-gray-600 text-sm">
                © 2025 Creative Templates App. Built with Next.js and Tailwind CSS.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
