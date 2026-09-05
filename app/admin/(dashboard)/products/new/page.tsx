import ProductForm from "@/components/admin/ProductForm";
import { createProductAction } from "../actions";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Add Product</h1>
      <p className="mt-1 text-sm text-slate-500">
        Add a physical product or digital book to your catalog.
      </p>
      <div className="mt-8">
        <ProductForm action={createProductAction} submitLabel="Create Product" />
      </div>
    </div>
  );
}
