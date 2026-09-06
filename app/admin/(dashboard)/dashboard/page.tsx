import Image from "next/image";
import { ClipboardList, Clock, PackageCheck, Wallet } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatNaira, formatDate, ORDER_STATUS_STYLES, ORDER_STATUS_LABELS } from "@/lib/utils";
import type { Order } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getMetrics() {
  const supabase = createServerSupabaseClient();

  const [ordersRes, pendingRes, availableProductsRes, invoicedRes, recentRes] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "PENDING"),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_available", true),
    supabase
      .from("orders")
      .select("id, products(price)")
      .in("status", ["INVOICED", "FULFILLED"]),
    supabase
      .from("orders")
      .select("*, products(title, slug, price, type)")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const totalRevenue = (invoicedRes.data ?? []).reduce((sum: number, row: any) => {
    return sum + (row.products?.price ?? 0);
  }, 0);

  return {
    totalOrders: ordersRes.count ?? 0,
    pendingOrders: pendingRes.count ?? 0,
    availableProducts: availableProductsRes.count ?? 0,
    totalRevenue,
    recentOrders: (recentRes.data ?? []) as Order[],
  };
}

export default async function AdminDashboardPage() {
  const { totalOrders, pendingOrders, availableProducts, totalRevenue, recentOrders } =
    await getMetrics();

  const cards = [
    { label: "Total Orders", value: totalOrders, icon: ClipboardList, color: "text-sky-400 bg-sky-500/15" },
    { label: "Pending Follow-ups", value: pendingOrders, icon: Clock, color: "text-amber-400 bg-amber-500/15" },
    { label: "Available Products", value: availableProducts, icon: PackageCheck, color: "text-solar-400 bg-solar-500/15" },
    { label: "Revenue (Invoiced+)", value: formatNaira(totalRevenue), icon: Wallet, color: "text-violet-400 bg-violet-500/15" },
  ];

  return (
    <div>
      <div className="flex items-center gap-3">
        {/* <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1.5">
          <Image src="/images/logo.jpg" alt="Vozaro logo" width={32} height={32} className="h-full w-full object-contain" />
        </span> */}
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-500">Overview of your store&apos;s activity.</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-navy-800 bg-navy-900 p-5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.color}`}>
              <c.icon size={18} />
            </span>
            <p className="mt-4 font-display text-2xl font-bold text-white">{c.value}</p>
            <p className="mt-1 text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-sm font-semibold text-white">Recent Orders</h2>
        <div className="overflow-x-auto rounded-2xl border border-navy-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-900 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800 bg-navy-900/40">
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No orders yet.
                  </td>
                </tr>
              )}
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-300">{order.order_number}</td>
                  <td className="px-4 py-3 text-slate-200">{order.customer_name}</td>
                  <td className="px-4 py-3 text-slate-400">{order.products?.title ?? "General consultation"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2.5 py-1 text-xs ${ORDER_STATUS_STYLES[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
