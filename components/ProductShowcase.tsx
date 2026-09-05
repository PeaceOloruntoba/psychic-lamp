import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

export default function ProductShowcase({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section id="products" className="bg-navy-950 py-20 sm:py-28">
      <div className="container-px mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Solar panels, inverters &amp; batteries
            </h2>
            <p className="mt-3 text-slate-400">
              Sourced from trusted manufacturers and matched to your property&apos;s
              actual power needs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
