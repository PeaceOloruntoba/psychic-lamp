"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { sendOrderInvoiceEmails } from "@/lib/email";
import { generateOrderNumber } from "@/lib/utils";
import type { Product } from "@/lib/types";

const orderSchema = z.object({
  productId: z.string().uuid().optional().or(z.literal("")),
  customerName: z.string().trim().min(2, "Please enter your full name."),
  customerEmail: z.string().trim().email("Please enter a valid email address."),
  customerPhone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number."),
  deliveryAddress: z.string().trim().optional(),
  additionalNotes: z.string().trim().optional(),
});

export type OrderActionState = {
  success: boolean;
  message: string;
  orderNumber?: string;
};

export async function processOrderAction(
  input: z.infer<typeof orderSchema>
): Promise<OrderActionState> {
  const parsed = orderSchema.safeParse(input);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid submission.";
    return { success: false, message: firstError };
  }

  const data = parsed.data;
  const supabase = createServiceRoleClient();

  let product: Product | null = null;
  if (data.productId) {
    const { data: productRow } = await supabase
      .from("products")
      .select("*")
      .eq("id", data.productId)
      .maybeSingle();
    product = productRow ?? null;
  }

  const orderNumber = generateOrderNumber();

  const { data: insertedOrder, error } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      product_id: data.productId || null,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      delivery_address: data.deliveryAddress || null,
      additional_notes: data.additionalNotes || null,
      status: "PENDING",
    })
    .select("*")
    .single();

  if (error || !insertedOrder) {
    console.error("processOrderAction: insert failed", error);
    return {
      success: false,
      message: "Something went wrong saving your order. Please try again.",
    };
  }

  try {
    await sendOrderInvoiceEmails(insertedOrder, product);
  } catch (emailError) {
    // The order is already saved — a failed email should not fail the request.
    console.error("processOrderAction: email dispatch failed", emailError);
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");

  return {
    success: true,
    message: "Your order was received! Check your email for confirmation.",
    orderNumber: insertedOrder.order_number,
  };
}
