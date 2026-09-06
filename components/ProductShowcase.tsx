import Image from "next/image";
import ProductCard from "./ProductCard";
import { STOCK_IMAGES } from "@/lib/stock-images";
import type { Product } from "@/lib/types";

export default function ProductShowcase({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section id="products" className="bg-navy-950 py-20 sm:py-28">
      <div className="container-px mx-auto max-w-7xl">
        <div className="mb-12 overflow-hidden rounded-2xl border border-navy-700">
          <div className="relative aspect-[21/9] w-full sm:aspect-[3/1]">
            <Image
              src={STOCK_IMAGES.solarPanelCloseup}
              alt="Close-up of solar panel cells"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
              <h2 className="max-w-md font-display text-2xl font-bold text-white sm:text-3xl">
                Solar panels, inverters &amp; batteries
              </h2>
              <p className="mt-2 max-w-sm text-sm text-slate-300 sm:text-base">
                Sourced from trusted manufacturers and matched to your
                property&apos;s actual power needs.
              </p>
            </div>
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
