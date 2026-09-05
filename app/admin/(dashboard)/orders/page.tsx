import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatDate, formatNaira, cn } from "@/lib/utils";
import OrderStatusSelect from "./OrderStatusSelect";
import type { Order, OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const FILTERS: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Contacted", value: "CONTACTED" },
  { label: "Invoiced", value: "INVOICED" },
  { label: "Fulfilled", value: "FULFILLED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const supabase = createServerSupabaseClient();
  const activeFilter = (searchParams.status?.toUpperCase() as OrderStatus | undefined) ?? "ALL";

  let query = supabase
    .from("orders")
    .select("*, products(title, slug, price, type)")
    .order("created_at", { ascending: false });

  if (activeFilter !== "ALL") {
    query = query.eq("status", activeFilter);
  }

  const { data: orders } = await query;
  const list = (orders ?? []) as Order[];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Orders</h1>
      <p className="mt-1 text-sm text-slate-500">Track and follow up on every order.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "ALL" ? "/admin/orders" : `/admin/orders?status=${f.value}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition",
              activeFilter === f.value
                ? "border-solar-500 bg-solar-500/15 text-solar-400"
                : "border-navy-700 text-slate-400 hover:border-navy-600"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-navy-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800 bg-navy-900/40">
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                  No orders in this view.
                </td>
              </tr>
            )}
            {list.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-mono text-xs text-slate-300">{order.order_number}</td>
                <td className="px-4 py-3">
                  <p className="text-slate-200">{order.customer_name}</p>
                  {order.delivery_address && (
                    <p className="mt-0.5 max-w-[200px] truncate text-xs text-slate-600">
                      {order.delivery_address}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  <p>{order.customer_phone}</p>
                  <p className="text-xs text-slate-600">{order.customer_email}</p>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {order.products ? (
                    <>
                      <p>{order.products.title}</p>
                      <p className="text-xs text-slate-600">{formatNaira(order.products.price)}</p>
                    </>
                  ) : (
                    "General consultation"
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">{formatDate(order.created_at)}</td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
