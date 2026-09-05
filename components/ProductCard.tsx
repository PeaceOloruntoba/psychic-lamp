"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import { useOrderModal } from "./OrderModalContext";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const { openOrderModal } = useOrderModal();
  const cover = product.images?.[0];

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-navy-700 bg-navy-800/50 transition hover:border-solar-500/40">
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] w-full overflow-hidden bg-navy-900">
        {cover ? (
          <Image
            src={cover}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-navy-700">
            <ImageOff size={32} />
          </div>
        )}
        {!product.is_available && (
          <span className="absolute left-3 top-3 rounded-full bg-navy-900/90 px-3 py-1 text-xs font-medium text-slate-300">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display text-base font-semibold text-white transition hover:text-solar-400">
            {product.title}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-slate-400">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-solar-400">
            {formatNaira(product.price)}
          </span>
          <button
            onClick={() =>
              openOrderModal({ id: product.id, title: product.title, type: product.type })
            }
            disabled={!product.is_available}
            className="rounded-full bg-navy-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-solar-500 hover:text-navy-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-navy-700 disabled:hover:text-white"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
