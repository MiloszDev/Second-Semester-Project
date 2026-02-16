"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Invoices",
    href: "/invoices",
  },
  {
    label: "Clients",
    href: "/clients",
  },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
           <Link href="/dashboard" className="font-bold text-xl flex items-center gap-2">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm">IG</div>
              <span>Invoice Gen</span>
           </Link>
           <nav className="hidden md:flex items-center gap-6">
             {routes.map((route) => (
               <Link
                 key={route.href}
                 href={route.href}
                 className={cn(
                   "text-sm font-medium transition-colors hover:text-primary",
                   pathname === route.href ? "text-primary" : "text-muted-foreground"
                 )}
               >
                 {route.label}
               </Link>
             ))}
           </nav>
        </div>
        {/* Mobile Navigation Placeholder - keeping it simple for now as requested */}
        <div className="ml-auto md:hidden">
             {/* Simple mobile menu could go here if needed, or just links */}
             <div className="flex gap-4 text-sm">
                {routes.map(r => (
                    <Link key={r.href} href={r.href} className={cn(pathname === r.href ? "font-bold" : "")}>{r.label}</Link>
                ))}
            </div>
        </div>
      </div>
    </header>
  );
}
