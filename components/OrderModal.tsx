"use client";

import { useEffect, useState, useTransition } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";
import { processOrderAction } from "@/app/actions/orderActions";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetProduct?: Pick<Product, "id" | "title" | "type">;
}

type FormErrors = Partial<Record<
  "customerName" | "customerEmail" | "customerPhone",
  string
>>;

export default function OrderModal({ isOpen, onClose, presetProduct }: OrderModalProps) {
  const [products, setProducts] = useState<Pick<Product, "id" | "title" | "type">[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();
  const [justSubmittedOrderNumber, setJustSubmittedOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setJustSubmittedOrderNumber(null);

    if (presetProduct) {
      setSelectedProductId(presetProduct.id);
      return;
    }

    let cancelled = false;
    const supabase = createClient();
    supabase
      .from("products")
      .select("id, title, type")
      .eq("is_available", true)
      .order("title")
      .then(({ data }) => {
        if (!cancelled && data) setProducts(data);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, presetProduct]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  function validate(): boolean {
    const next: FormErrors = {};
    if (customerName.trim().length < 2) next.customerName = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(customerEmail)) next.customerEmail = "Enter a valid email.";
    if (customerPhone.trim().length < 7) next.customerPhone = "Enter a valid phone number.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function resetForm() {
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setDeliveryAddress("");
    setAdditionalNotes("");
    setErrors({});
    if (!presetProduct) setSelectedProductId("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      const result = await processOrderAction({
        productId: selectedProductId || presetProduct?.id || "",
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        additionalNotes,
      });

      if (result.success) {
        toast.success(result.message);
        setJustSubmittedOrderNumber(result.orderNumber ?? null);
        resetForm();
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleClose() {
    onClose();
    setTimeout(() => setJustSubmittedOrderNumber(null), 300);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-navy-950/80 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      onClick={handleClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-navy-700 bg-navy-800 shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-navy-700 bg-navy-800/95 px-5 py-4 backdrop-blur">
          <h2 id="order-modal-title" className="font-display text-lg font-semibold text-white">
            {presetProduct ? `Order — ${presetProduct.title}` : "Book Installation / Consultation"}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-navy-700 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {justSubmittedOrderNumber ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <CheckCircle2 className="text-solar-400" size={48} />
            <p className="font-display text-xl font-semibold text-white">Order received!</p>
            <p className="text-sm text-slate-400">
              Reference: <span className="font-mono text-solar-400">{justSubmittedOrderNumber}</span>
            </p>
            <p className="max-w-sm text-sm text-slate-400">
              We&apos;ve emailed you a confirmation. Our team will reach out shortly to confirm next steps.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 rounded-full bg-solar-500 px-6 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-solar-400"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
            {!presetProduct && (
              <div>
                <label htmlFor="product" className="mb-1.5 block text-sm font-medium text-slate-300">
                  Service or Product{" "}
                  <span className="font-normal text-slate-500">(optional)</span>
                </label>
                <select
                  id="product"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-solar-500"
                >
                  <option value="">General consultation</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} {p.type === "DIGITAL_BOOK" ? "(Digital Book)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Field
              id="customerName"
              label="Full Name"
              value={customerName}
              onChange={setCustomerName}
              error={errors.customerName}
              placeholder="e.g. Chinedu Okafor"
              autoComplete="name"
            />
            <Field
              id="customerEmail"
              label="Email Address"
              type="email"
              value={customerEmail}
              onChange={setCustomerEmail}
              error={errors.customerEmail}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Field
              id="customerPhone"
              label="Phone Number"
              type="tel"
              value={customerPhone}
              onChange={setCustomerPhone}
              error={errors.customerPhone}
              placeholder="080X XXX XXXX"
              autoComplete="tel"
            />
            <Field
              id="deliveryAddress"
              label="Delivery / Installation Address"
              value={deliveryAddress}
              onChange={setDeliveryAddress}
              placeholder="Optional"
              required={false}
            />

            <div>
              <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-slate-300">
                Additional Notes <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <textarea
                id="notes"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={3}
                placeholder="Tell us about your property, current setup, or timeline..."
                className="w-full resize-none rounded-lg border border-navy-700 bg-navy-900 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-solar-500"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-full bg-solar-500 py-3 text-sm font-semibold text-navy-900 transition hover:bg-solar-400",
                isPending && "cursor-not-allowed opacity-70"
              )}
            >
              {isPending && <Loader2 className="animate-spin" size={16} />}
              {isPending ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
  required = true,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label} {required && <span className="text-solar-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          "w-full rounded-lg border bg-navy-900 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-solar-500",
          error ? "border-red-500/60" : "border-navy-700"
        )}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
