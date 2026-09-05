"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import type { Product } from "@/lib/types";
import type { ProductFormState } from "@/app/admin/(dashboard)/products/actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 rounded-full bg-solar-500 px-8 py-3 text-sm font-semibold text-navy-900 transition hover:bg-solar-400 disabled:opacity-70"
    >
      {pending && <Loader2 size={16} className="animate-spin" />}
      {pending ? "Saving..." : label}
    </button>
  );
}

function specsToRaw(specs: Record<string, string> | undefined): string {
  if (!specs) return "";
  return Object.entries(specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

export default function ProductForm({
  action,
  product,
  submitLabel = "Save Product",
}: {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  product?: Product;
  submitLabel?: string;
}) {
  const [state, formAction] = useFormState(action, {});
  const [type, setType] = useState<"PHYSICAL" | "DIGITAL_BOOK">(product?.type ?? "PHYSICAL");
  const [images, setImages] = useState<string[]>(product?.images ?? []);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Product Type</label>
        <div className="flex gap-3">
          <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-navy-700 bg-navy-900 py-3 text-sm text-slate-300 has-[:checked]:border-solar-500 has-[:checked]:text-solar-400">
            <input
              type="radio"
              name="type"
              value="PHYSICAL"
              checked={type === "PHYSICAL"}
              onChange={() => setType("PHYSICAL")}
              className="sr-only"
            />
            Physical Product
          </label>
          <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-navy-700 bg-navy-900 py-3 text-sm text-slate-300 has-[:checked]:border-solar-500 has-[:checked]:text-solar-400">
            <input
              type="radio"
              name="type"
              value="DIGITAL_BOOK"
              checked={type === "DIGITAL_BOOK"}
              onChange={() => setType("DIGITAL_BOOK")}
              className="sr-only"
            />
            Digital Book
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-300">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={product?.title}
          className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-solar-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-300">
          Description{" "}
          <span className="font-normal text-slate-500">
            {type === "DIGITAL_BOOK" ? "— one key takeaway per line" : ""}
          </span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          defaultValue={product?.description}
          className="w-full resize-none rounded-lg border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-solar-500"
        />
      </div>

      <div>
        <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-slate-300">
          Price (₦)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min={0}
          step="0.01"
          required
          defaultValue={product?.price}
          className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-solar-500"
        />
      </div>

      {type === "DIGITAL_BOOK" && (
        <div>
          <label htmlFor="selarUrl" className="mb-1.5 block text-sm font-medium text-slate-300">
            Selar URL
          </label>
          <input
            id="selarUrl"
            name="selarUrl"
            type="url"
            placeholder="https://selar.co/..."
            defaultValue={product?.selar_url ?? ""}
            className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-solar-500"
          />
        </div>
      )}

      {type === "PHYSICAL" && (
        <div>
          <label htmlFor="specificationsRaw" className="mb-1.5 block text-sm font-medium text-slate-300">
            Specifications{" "}
            <span className="font-normal text-slate-500">— one per line, e.g. "Voltage: 12V"</span>
          </label>
          <textarea
            id="specificationsRaw"
            name="specificationsRaw"
            rows={4}
            defaultValue={specsToRaw(product?.specifications)}
            placeholder={"Voltage: 12V\nWattage: 300W\nWarranty: 5 years"}
            className="w-full resize-none rounded-lg border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white outline-none focus:border-solar-500"
          />
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-300">Images</label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <label className="flex items-center gap-2.5 text-sm text-slate-300">
        <input
          type="checkbox"
          name="isAvailable"
          defaultChecked={product?.is_available ?? true}
          className="h-4 w-4 rounded border-navy-700 bg-navy-900 accent-solar-500"
        />
        Available for order
      </label>

      {state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <SubmitButton label={submitLabel} />
    </form>
  );
}
