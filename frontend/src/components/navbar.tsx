"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ListFilter, UploadIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const ITEMS = [
  {
    label: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    label: "Transactions",
    icon: ListFilter,
    href: "/transactions",
  },
  {
    label: "Imports",
    icon: UploadIcon,
    href: "/imports",
  },
] as const;

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex gap-x-6">
      <Link href="/" className="flex items-center">
        <span className="font-bold">Banko</span>
      </Link>
      <nav className="flex items-center gap-x-6 text-sm font-medium">
        {ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center transition-colors hover:text-foreground/80",
              pathname === item.href ? "text-foreground" : "text-foreground/60"
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};
