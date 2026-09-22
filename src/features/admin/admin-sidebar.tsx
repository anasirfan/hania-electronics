"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ImageIcon,
  Megaphone,
  Home,
  ShoppingBag,
  Database,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/announcement", label: "Announcement", icon: Megaphone },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/setup", label: "Supabase", icon: Database },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-white">
      <div className="border-b border-border px-5 py-5">
        <p className="font-heading text-sm font-semibold tracking-tight">
          HANIA Admin
        </p>
        <p className="text-xs text-muted-foreground">Ecommerce dashboard</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-primary text-white"
                  : "text-foreground/80 hover:bg-accent",
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
        <Link
          href="/"
          className="mt-1 block px-3 py-2 text-xs text-muted-foreground hover:text-primary"
        >
          ← View storefront
        </Link>
      </div>
    </aside>
  );
}
