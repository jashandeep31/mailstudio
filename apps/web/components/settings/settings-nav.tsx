"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links: { name: string; href: string }[] = [
  { name: "Profile", href: "/dashboard/settings" },
  { name: "Billings", href: "/dashboard/settings/billings" },
  { name: "Payments", href: "/dashboard/settings/payments" },
  { name: "Test Mails", href: "/dashboard/settings/test-mails" },
];

interface SettingsNavProps {
  className?: string;
}

export const SettingsNav = ({ className = "" }: SettingsNavProps) => {
  const pathname = usePathname();

  return (
    <div
      className={`mt-4 flex gap-6 ${className} hidden-scrollbar overflow-x-auto`}
    >
      {links.map((link) => (
        <Link
          href={link.href}
          className={
            pathname === link.href
              ? "text-foreground border-primary border-b-2 pb-2"
              : "text-muted-foreground hover:text-foreground border-b-2 border-transparent pb-2"
          }
          key={link.name}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};
