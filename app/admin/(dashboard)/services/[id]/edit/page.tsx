import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import ServiceForm from "@/components/admin/ServiceForm";
import { updateServiceAction } from "../../actions";
import type { Service } from "@/lib/types";

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!service) notFound();

  const boundAction = updateServiceAction.bind(null, params.id);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Edit Service</h1>
      <p className="mt-1 text-sm text-slate-500">{(service as Service).title}</p>
      <div className="mt-8">
        <ServiceForm action={boundAction} service={service as Service} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
