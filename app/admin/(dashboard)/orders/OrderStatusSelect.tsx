"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateOrderStatusAction } from "./actions";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES, cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = ["PENDING", "CONTACTED", "INVOICED", "FULFILLED", "CANCELLED"];

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, next);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={cn(
        "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium outline-none disabled:opacity-60",
        ORDER_STATUS_STYLES[currentStatus]
      )}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-navy-900 text-white">
          {ORDER_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
