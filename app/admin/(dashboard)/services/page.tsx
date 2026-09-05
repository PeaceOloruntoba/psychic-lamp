import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Plus, Pencil } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { deleteServiceAction } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";

function resolveIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sun;
}

export default async function AdminServicesPage() {
  const supabase = createServerSupabaseClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("sort_order");

  const list = (services ?? []) as Service[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Services</h1>
          <p className="mt-1 text-sm text-slate-500">Manage what shows in the Services section.</p>
        </div>
        <Link
          href="/admin/services/new"
          className="flex items-center gap-2 rounded-full bg-solar-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-solar-400"
        >
          <Plus size={16} /> Add Service
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.length === 0 && (
          <p className="col-span-full py-10 text-center text-slate-500">
            No services yet. Add your first one.
          </p>
        )}
        {list.map((service) => {
          const Icon = resolveIcon(service.icon_name);
          return (
            <div key={service.id} className="rounded-2xl border border-navy-800 bg-navy-900 p-5">
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-solar-500/15 text-solar-400">
                  <Icon size={18} />
                </span>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/services/${service.id}/edit`}
                    className="flex items-center gap-1 rounded-full border border-navy-700 px-2.5 py-1 text-xs text-slate-300 transition hover:border-solar-500 hover:text-solar-400"
                  >
                    <Pencil size={12} /> Edit
                  </Link>
                  <DeleteButton
                    action={deleteServiceAction}
                    idFieldName="serviceId"
                    id={service.id}
                    confirmMessage={`Delete "${service.title}"?`}
                  />
                </div>
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-white">{service.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{service.description}</p>
              <p className="mt-3 text-xs text-slate-600">Order: {service.sort_order}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
