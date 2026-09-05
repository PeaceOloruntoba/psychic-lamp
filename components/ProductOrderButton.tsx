"use client";

import { useOrderModal } from "./OrderModalContext";
import type { Product } from "@/lib/types";

export default function ProductOrderButton({
  product,
}: {
  product: Pick<Product, "id" | "title" | "type" | "is_available">;
}) {
  const { openOrderModal } = useOrderModal();

  return (
    <button
      onClick={() => openOrderModal(product)}
      disabled={!product.is_available}
      className="w-full rounded-full bg-solar-500 py-3.5 text-sm font-semibold text-navy-900 transition hover:bg-solar-400 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-10"
    >
      {product.is_available ? "Order / Book Product" : "Currently Unavailable"}
    </button>
  );
}
