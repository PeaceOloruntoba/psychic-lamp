"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Service } from "@/lib/types";
import type { ServiceFormState } from "@/app/admin/(dashboard)/services/actions";

const ICON_OPTIONS = [
  "Sun",
  "BatteryCharging",
  "Wrench",
  "ShieldCheck",
  "ClipboardCheck",
  "Zap",
  "PlugZap",
  "Cable",
  "Video",
  "Fence",
  "Settings",
  "LifeBuoy",
];

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-solar-500 px-8 py-3 text-sm font-semibold text-navy-900 transition hover:bg-solar-400 disabled:opacity-70"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

export default function ServiceForm({
  action,
  service,
  submitLabel = "Save Service",
}: {
  action: (state: ServiceFormState, formData: FormData) => Promise<ServiceFormState>;
  service?: Service;
  submitLabel?: string;
}) {
  const [state, formAction] = useFormState(action, {});
  const [iconName, setIconName] = useState(service?.icon_name ?? "Sun");

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-300">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={service?.title}
          className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-solar-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-300">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={service?.description}
          className="w-full resize-none rounded-lg border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-solar-500"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Icon</label>
        <input type="hidden" name="iconName" value={iconName} />
        <div className="grid grid-cols-6 gap-2">
          {ICON_OPTIONS.map((name) => {
            const Icon = (Icons as unknown as Record<string, LucideIcon>)[name];
            return (
              <button
                key={name}
                type="button"
                onClick={() => setIconName(name)}
                className={`flex aspect-square items-center justify-center rounded-lg border transition ${
                  iconName === name
                    ? "border-solar-500 bg-solar-500/15 text-solar-400"
                    : "border-navy-700 text-slate-400 hover:border-navy-600"
                }`}
                aria-label={name}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="mb-1.5 block text-sm font-medium text-slate-300">
          Image URL <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={service?.image_url ?? ""}
          placeholder="https://res.cloudinary.com/..."
          className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-solar-500"
        />
      </div>

      <div>
        <label htmlFor="sortOrder" className="mb-1.5 block text-sm font-medium text-slate-300">
          Display Order
        </label>
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          defaultValue={service?.sort_order ?? 0}
          className="w-32 rounded-lg border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-solar-500"
        />
      </div>

      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <SubmitButton label={submitLabel} />
    </form>
  );
}
