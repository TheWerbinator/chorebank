import { Geist } from "next/font/google"; // Keep font
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ThemeSwitcher } from "@/components/theme-switcher";
import NavBar from "@/components/navbar";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChoreBank - Make Chores Fun & Rewarding",
  description:
    "Track chores, assign rewards, and help your family stay organized — all in one easy-to-use app.",
  openGraph: {
    title: "ChoreBank - Make Chores Fun & Rewarding",
    description:
      "Track chores, assign rewards, and help your family stay organized — all in one easy-to-use app.",
    images: [
      {
        url: "../opengraph-image.png",
        alt: "A mother adds a gold coin to a piggy bank while her son cheers in the background.",
      },
    ],
    url: "https://www.chorebank.vercel.app",
    type: "website",
    siteName: "ChoreBank",
  },
  other: { pinterest: "nopin" },
  metadataBase: new URL("https://www.chorebank.vercel.app"),
  alternates: {
    canonical: "https://www.chorebank.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.className} antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <div className='min-h-screen flex flex-col'>
            <NavBar />
            {/* Main content */}
            <main className='flex-1 w-full max-w-5xl mx-auto pt-20 px-5 flex flex-col gap-16'>
              {children}
            </main>

            {/* Footer */}
            <footer className='w-full border-t border-border/20 mt-auto bg-background/90 backdrop-blur-sm'>
              <div className='max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center py-10 px-5 gap-4 text-sm text-foreground/80'>
                <p className='text-center md:text-left'>
                  &copy; {new Date().getFullYear()} ChoreBank — built by{" "}
                  <a
                    href='https://www.linkedin.com/in/connorspendlove/'
                    target='_blank'
                    rel='noreferrer'
                    className='font-bold hover:underline'
                  >
                    Connor Spendlove
                  </a>{" "}
                  &{" "}
                  <a
                    href='https://www.linkedin.com/in/shawn-werber/'
                    target='_blank'
                    rel='noreferrer'
                    className='font-bold hover:underline'
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
