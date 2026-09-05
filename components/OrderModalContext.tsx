"use client";

import { createContext, useContext, useState, useCallback } from "react";
import OrderModal from "./OrderModal";
import type { Product } from "@/lib/types";

interface OrderModalContextValue {
  openOrderModal: (product?: Pick<Product, "id" | "title" | "type">) => void;
}

const OrderModalContext = createContext<OrderModalContextValue | null>(null);

export function OrderModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetProduct, setPresetProduct] = useState<
    Pick<Product, "id" | "title" | "type"> | undefined
  >(undefined);

  const openOrderModal = useCallback(
    (product?: Pick<Product, "id" | "title" | "type">) => {
      setPresetProduct(product);
      setIsOpen(true);
    },
    []
  );

  return (
    <OrderModalContext.Provider value={{ openOrderModal }}>
      {children}
      <OrderModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        presetProduct={presetProduct}
      />
    </OrderModalContext.Provider>
  );
}

export function useOrderModal() {
  const ctx = useContext(OrderModalContext);
  if (!ctx) {
    throw new Error("useOrderModal must be used within an OrderModalProvider");
  }
  return ctx;
}
