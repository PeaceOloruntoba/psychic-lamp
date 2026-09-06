"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { deleteCloudinaryImage, extractPublicId } from "@/lib/cloudinary";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  type: z.enum(["PHYSICAL", "DIGITAL_BOOK"]),
  description: z.string().trim().min(1, "Description is required."),
  price: z.coerce.number().min(0, "Price must be 0 or more."),
  selarUrl: z.string().trim().url().optional().or(z.literal("")),
  isAvailable: z.coerce.boolean(),
  images: z.array(z.string().url()).default([]),
  specifications: z.record(z.string()).default({}),
});

export type ProductFormState = { error?: string };

async function assertAdmin() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return supabase;
}

function parseSpecifications(raw: string): Record<string, string> {
  // Expects lines like "Voltage: 12V" — tolerant of blank lines / missing colons.
  const entries: Record<string, string> = {};
  raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (key && value) entries[key] = value;
    });
  return entries;
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const supabase = await assertAdmin();

  const parsed = productSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    description: formData.get("description"),
    price: formData.get("price"),
    selarUrl: formData.get("selarUrl") || "",
    isAvailable: formData.get("isAvailable") === "on",
    images: JSON.parse(String(formData.get("images") || "[]")),
    specifications: parseSpecifications(String(formData.get("specificationsRaw") || "")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const data = parsed.data;
  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let suffix = 1;
  while (true) {
    const { data: existing } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${++suffix}`;
  }

  const { error } = await supabase.from("products").insert({
    title: data.title,
    slug,
    type: data.type,
    description: data.description,
    price: data.price,
    specifications: data.specifications,
    images: data.images,
    selar_url: data.selarUrl || null,
    is_available: data.isAvailable,
  });

  if (error) {
    console.error(error);
    return { error: "Failed to create product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProductAction(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const supabase = await assertAdmin();

  const parsed = productSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    description: formData.get("description"),
    price: formData.get("price"),
    selarUrl: formData.get("selarUrl") || "",
    isAvailable: formData.get("isAvailable") === "on",
    images: JSON.parse(String(formData.get("images") || "[]")),
    specifications: parseSpecifications(String(formData.get("specificationsRaw") || "")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const data = parsed.data;

  const { error } = await supabase
    .from("products")
    .update({
      title: data.title,
      type: data.type,
      description: data.description,
      price: data.price,
      specifications: data.specifications,
      images: data.images,
      selar_url: data.selarUrl || null,
      is_available: data.isAvailable,
    })
    .eq("id", productId);

  if (error) {
    console.error(error);
    return { error: "Failed to update product." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  const supabase = await assertAdmin();
  const productId = String(formData.get("productId"));

  const { data: product } = await supabase
    .from("products")
    .select("images")
    .eq("id", productId)
    .maybeSingle();

  await supabase.from("products").delete().eq("id", productId);

  if (product?.images?.length) {
    await Promise.allSettled(
      product.images.map((url: string) => {
        const publicId = extractPublicId(url);
        return publicId ? deleteCloudinaryImage(publicId) : Promise.resolve();
      })
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
}
