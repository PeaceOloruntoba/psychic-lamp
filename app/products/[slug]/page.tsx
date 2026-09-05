import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { OrderModalProvider } from "@/components/OrderModalContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import ProductOrderButton from "@/components/ProductOrderButton";
import { formatNaira } from "@/lib/utils";
import type { Product } from "@/lib/types";

export const revalidate = 60;

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data as Product | null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.description.slice(0, 155),
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const specs = Object.entries(product.specifications ?? {});
  const isBook = product.type === "DIGITAL_BOOK";

  return (
    <OrderModalProvider>
      <Navbar />
      <main className="bg-navy-900 pb-24 pt-28">
        <div className="container-px mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <ProductGallery images={product.images ?? []} title={product.title} />

            <div>
              <span className="mb-3 inline-block rounded-full bg-solar-500/15 px-3 py-1 text-xs font-medium text-solar-400">
                {isBook ? "Digital Book" : "Solar Equipment"}
              </span>
              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
                {product.title}
              </h1>
              <p className="mt-4 whitespace-pre-line text-slate-400">
                {product.description}
              </p>

              <p className="mt-6 font-display text-2xl font-semibold text-solar-400">
                {formatNaira(product.price)}
              </p>

              {specs.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-3 text-sm font-semibold text-white">Specifications</h2>
                  <dl className="divide-y divide-navy-700 rounded-xl border border-navy-700">
                    {specs.map(([key, value]) => (
                      <div key={key} className="flex justify-between px-4 py-3 text-sm">
                        <dt className="text-slate-500">{key}</dt>
                        <dd className="text-slate-200">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                {isBook && product.selar_url ? (
                  <a
                    href={product.selar_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-solar-500 py-3.5 text-sm font-semibold text-navy-900 transition hover:bg-solar-400 sm:w-auto sm:px-10"
                  >
                    Get it on Selar <ExternalLink size={16} />
                  </a>
                ) : (
                  <ProductOrderButton product={product} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </OrderModalProvider>
  );
}
