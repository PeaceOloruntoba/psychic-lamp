"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { slugify } from "@/lib/utils";

const serviceSchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  description: z.string().trim().min(1, "Description is required."),
  iconName: z.string().trim().min(1, "Icon is required."),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  sortOrder: z.coerce.number().default(0),
});

export type ServiceFormState = { error?: string };

async function assertAdmin() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return supabase;
}

export async function createServiceAction(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const supabase = await assertAdmin();

  const parsed = serviceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    iconName: formData.get("iconName"),
    imageUrl: formData.get("imageUrl"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const data = parsed.data;
  const baseSlug = slugify(data.title);
  let slug = baseSlug;
  let suffix = 1;
  while (true) {
    const { data: existing } = await supabase.from("services").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${++suffix}`;
  }

  const { error } = await supabase.from("services").insert({
    title: data.title,
    slug,
    description: data.description,
    icon_name: data.iconName,
    image_url: data.imageUrl || null,
    sort_order: data.sortOrder,
  });

  if (error) {
    console.error(error);
    return { error: "Failed to create service." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function updateServiceAction(
  serviceId: string,
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const supabase = await assertAdmin();

  const parsed = serviceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    iconName: formData.get("iconName"),
    imageUrl: formData.get("imageUrl"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const data = parsed.data;

  const { error } = await supabase
    .from("services")
    .update({
      title: data.title,
      description: data.description,
      icon_name: data.iconName,
      image_url: data.imageUrl || null,
      sort_order: data.sortOrder,
    })
    .eq("id", serviceId);

  if (error) {
    console.error(error);
    return { error: "Failed to update service." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function deleteServiceAction(formData: FormData) {
  const supabase = await assertAdmin();
  const serviceId = String(formData.get("serviceId"));
  await supabase.from("services").delete().eq("id", serviceId);
  revalidatePath("/admin/services");
  revalidatePath("/");
}
