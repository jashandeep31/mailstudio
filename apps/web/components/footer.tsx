import Link from "next/link";
import { Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-bold">MailStudio</h3>
            <p className="text-muted-foreground max-w-xs text-sm">
              Empowering creators to build beautiful, responsive emails with the
              speed of AI.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-foreground/80 text-sm font-semibold tracking-wider uppercase">
              Company
            </h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-foreground/80 text-sm font-semibold tracking-wider uppercase">
              Legal
            </h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} MailStudio. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://x.com/jashandeep31"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
              aria-label="Follow us on X"
            >
              <Twitter className="size-5" /> @jashandeep31
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
