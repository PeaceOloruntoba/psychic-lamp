"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const statusSchema = z.enum(["PENDING", "CONTACTED", "INVOICED", "FULFILLED", "CANCELLED"]);

async function assertAdmin() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return supabase;
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) {
    return { success: false, message: "Invalid status." };
  }

  const supabase = await assertAdmin();
  const { error } = await supabase
    .from("orders")
    .update({ status: parsed.data })
    .eq("id", orderId);

  if (error) {
    console.error(error);
    return { success: false, message: "Failed to update order." };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
  return { success: true, message: "Order updated." };
}
