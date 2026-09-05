"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export type LoginState = { error?: string };

export async function signInAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin/dashboard");

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: "Invalid email or password." };
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!adminRow) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized for admin access." };
  }

  redirect(next || "/admin/dashboard");
}

export async function signOutAction() {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
