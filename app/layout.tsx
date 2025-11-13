import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL("https://chorebank.vercel.app"),
  title: "Easy Chore Tracker for Parents and Kids | ChoreBank",
  description:
    "Simplify family chores and rewards with ChoreBank. Parents can easily assign tasks and kids can earn rewards, making household management fun and engaging for everyone.",
};

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
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <main className='min-h-screen flex flex-col items-center'>
            <div className='flex-1 w-full flex flex-col gap-20 items-center'>
              <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
                <div className='w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm'>
                  <div className='flex gap-5 items-center font-semibold'>
                    <Link href={"/"}>ChoreBank</Link>
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
                </div>
              </nav>
              {children}

              <footer className='w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16'>
                <p>
                  Project by{" "}
                  <a
                    href='https://www.linkedin.com/in/connorspendlove/'
                    target='_blank'
                    className='font-bold hover:underline'
                    rel='noreferrer'
                  >
                    Connor Spendlove
                  </a>{" "}
                  and{" "}
                  <a
                    href='https://www.linkedin.com/in/shawn-werber/'
                    target='_blank'
                    className='font-bold hover:underline'
                    rel='noreferrer'
                  >
                    Shawn Werber
                  </a>
                </p>
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
