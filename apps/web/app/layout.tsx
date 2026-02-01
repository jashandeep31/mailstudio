import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@repo/ui/globals.css";
import Provider from "./provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "./provider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Mail Studio - Design, manage, and ship email templates faster",
    template: "%s | Mail Studio",
  },
  description:
    "Mail Studio is the API-first platform for building beautiful emails. Generate with AI, customize with MJML, and deploy via our global edge network.",
  metadataBase: new URL("https://mailstudio.dev"),
  keywords: [
    "email templates",
    "AI email generator",
    "MJML",
    "email builder",
    "API-first email",
    "developer tools",
  ],
  authors: [{ name: "Jashandeep Singh", url: "https://x.com/jashandeep31" }],
  creator: "Jashandeep Singh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mailstudio.dev",
    title: "Mail Studio - Design, manage, and ship email templates faster",
    description:
      "Mail Studio is the API-first platform for building beautiful emails. Generate with AI, customize with MJML, and deploy via our global edge network.",
    siteName: "Mail Studio",
  },
  twitter: {
    card: "summary",
    title: "Mail Studio - Design, manage, and ship email templates faster",
    description:
      "Mail Studio is the API-first platform for building beautiful emails. Generate with AI, customize with MJML, and deploy via our global edge network.",
    creator: "@jashandeep31",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <>
            <Toaster richColors />
            <Provider>{children}</Provider>
            <Analytics />
          </>
        </ThemeProvider>
      </body>
    </html>
  );
}
