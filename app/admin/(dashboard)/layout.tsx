import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Package, Wrench, ClipboardList, LogOut } from "lucide-react";
import { signOutAction } from "../login/actions";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-950 lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-navy-800 bg-navy-900 lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-navy-800 px-6">
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white p-1">
            <Image src="/images/logo.jpg" alt="Vozaro logo" width={24} height={24} className="h-full w-full object-contain" />
          </span>
          <span className="font-display text-sm font-bold text-white">VOZARO Admin</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-navy-800 hover:text-white"
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={signOutAction} className="border-t border-navy-800 p-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition hover:bg-navy-800 hover:text-red-400">
            <LogOut size={17} />
            Sign out
          </button>
        </form>
      </aside>

      <div className="flex-1">
        <div className="flex h-16 items-center justify-between border-b border-navy-800 bg-navy-900 px-5 lg:hidden">
          <span className="font-display text-sm font-bold text-white">VOZARO Admin</span>
          <form action={signOutAction}>
            <button className="text-sm text-slate-400 hover:text-red-400">Sign out</button>
          </form>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-b border-navy-800 bg-navy-900 px-3 py-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-navy-800 hover:text-white"
            >
              <item.icon size={14} />
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
