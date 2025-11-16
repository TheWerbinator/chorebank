import { Geist } from "next/font/google"; // Keep font
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="w-full border-b border-gray-300/20 dark:border-gray-700/20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm fixed top-0 z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center h-16 px-4 sm:px-5">
                  {/* Logo / Site Name */}
                  <Link
                    href="/"
                    className="font-extrabold text-lg md:text-xl text-gray-800 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    ChoreBank
                  </Link>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 md:gap-4">
                    <Link
                      href="/auth/sign-up"
                      className="px-3 py-1 md:px-4 md:py-2 rounded-lg bg-purple-600 dark:bg-purple-500 text-white font-semibold text-xs md:text-sm hover:bg-purple-500 dark:hover:bg-purple-400 transition-colors"
                    >
                      Get Started
                    </Link>
                    <Link
                      href="/auth/login"
                      className="px-3 py-1 md:px-4 md:py-2 rounded-lg border border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 font-semibold text-xs md:text-sm hover:bg-purple-100 dark:hover:bg-purple-700 transition-colors"
                    >
                      Login
                    </Link>
                  </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="flex-1 w-full max-w-5xl mx-auto pt-20 px-5 flex flex-col gap-16">
              {children}
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-border/20 mt-auto bg-background/90 backdrop-blur-sm">
              <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center py-10 px-5 gap-4 text-sm text-foreground/80">
                <p className="text-center md:text-left">
                  &copy; {new Date().getFullYear()} ChoreBank — built by{" "}
                  <a
                    href="https://www.linkedin.com/in/connorspendlove/"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold hover:underline"
                  >
                    Connor Spendlove
                  </a>{" "}
                  &{" "}
                  <a
                    href="https://www.linkedin.com/in/shawn-werber/"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold hover:underline"
                  >
                    Shawn Werber
                  </a>
                </p>
                <ThemeSwitcher />
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
