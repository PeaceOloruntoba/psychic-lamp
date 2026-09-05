"use client";

import { Trash2 } from "lucide-react";

export default function DeleteButton({
  action,
  id,
  idFieldName,
  confirmMessage,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  idFieldName: string;
  confirmMessage: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <input type="hidden" name={idFieldName} value={id} />
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-full border border-navy-700 px-3 py-1.5 text-xs text-slate-400 transition hover:border-red-500/50 hover:text-red-400"
      >
        <Trash2 size={13} /> Delete
      </button>
    </form>
  );
}
