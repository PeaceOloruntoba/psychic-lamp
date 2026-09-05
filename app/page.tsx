import { createServerSupabaseClient } from "@/lib/supabase-server";
import { OrderModalProvider } from "@/components/OrderModalContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import ProductShowcase from "@/components/ProductShowcase";
import DigitalBookPreview from "@/components/DigitalBookPreview";
import Footer from "@/components/Footer";
import type { Product, Service } from "@/lib/types";

export const revalidate = 60;

async function getData() {
  const supabase = createServerSupabaseClient();

  const [{ data: services }, { data: products }] = await Promise.all([
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("products").select("*").order("created_at", { ascending: false }),
  ]);

  return {
    services: (services ?? []) as Service[],
    products: (products ?? []) as Product[],
  };
}

export default async function HomePage() {
  const { services, products } = await getData();
  const physicalProducts = products.filter((p) => p.type === "PHYSICAL");
  const digitalBooks = products.filter((p) => p.type === "DIGITAL_BOOK");

  return (
    <OrderModalProvider>
      <Navbar />
      <main>
        <Hero />
        <ServicesGrid services={services} />
        <ProductShowcase products={physicalProducts} />
        <DigitalBookPreview books={digitalBooks} />
      </main>
      <Footer />
    </OrderModalProvider>
  );
}
