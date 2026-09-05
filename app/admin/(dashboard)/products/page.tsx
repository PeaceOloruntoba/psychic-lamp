import Link from "next/link";
import Image from "next/image";
import { Plus, ImageOff, Pencil } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatNaira } from "@/lib/utils";
import { deleteProductAction } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = createServerSupabaseClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (products ?? []) as Product[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Products</h1>
          <p className="mt-1 text-sm text-slate-500">Manage physical products and digital books.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-solar-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-solar-400"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-navy-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-900 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800 bg-navy-900/40">
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No products yet. Add your first product to get started.
                </td>
              </tr>
            )}
            {list.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-navy-800 bg-navy-800">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt="" fill sizes="40px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-navy-700">
                          <ImageOff size={16} />
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-slate-200">{product.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {product.type === "DIGITAL_BOOK" ? "Digital Book" : "Physical"}
                </td>
                <td className="px-4 py-3 text-slate-300">{formatNaira(product.price)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs ${
                      product.is_available
                        ? "border-solar-500/30 bg-solar-500/15 text-solar-400"
                        : "border-navy-700 bg-navy-800 text-slate-500"
                    }`}
                  >
                    {product.is_available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="flex items-center gap-1.5 rounded-full border border-navy-700 px-3 py-1.5 text-xs text-slate-300 transition hover:border-solar-500 hover:text-solar-400"
                    >
                      <Pencil size={13} /> Edit
                    </Link>
                    <DeleteButton
                      action={deleteProductAction}
                      idFieldName="productId"
                      id={product.id}
                      confirmMessage={`Delete "${product.title}"? This can't be undone.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
