import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import ProductForm from "@/components/admin/ProductForm";
import { updateProductAction } from "../../actions";
import type { Product } from "@/lib/types";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, params.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Edit Product</h1>
      <p className="mt-1 text-sm text-slate-500">{(product as Product).title}</p>
      <div className="mt-8">
        <ProductForm action={boundAction} product={product as Product} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
