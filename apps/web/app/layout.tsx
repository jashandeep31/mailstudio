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

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mailstudio.com";
const siteTitle = "Mail Studio";
const defaultTitle = "";
const defaultDescription =
  "Mail Studio helps you generate AI-powered email templates, then return production-ready MJML and HTML with a WYSIWYG editor for fast visual edits.";

export const metadata: Metadata = {
  title: {
    default: `${siteTitle} - ${defaultTitle}`,
    template: `%s | ${siteTitle}`,
  },
  description: defaultDescription,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "ai email template builder",
    "mjml generator",
    "html email generator",
    "wysiwyg email editor",
    "email templates",
    "MJML",
    "email builder",
    "responsive email templates",
  ],
  authors: [{ name: "Jashandeep Singh", url: "https://x.com/jashandeep31" }],
  creator: "Jashandeep Singh",
  applicationName: siteTitle,
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: `${siteTitle} - ${defaultTitle}`,
    description: defaultDescription,
    siteName: siteTitle,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteTitle} - ${defaultTitle}`,
    description: defaultDescription,
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
