import ServiceForm from "@/components/admin/ServiceForm";
import { createServiceAction } from "../actions";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white">Add Service</h1>
      <p className="mt-1 text-sm text-slate-500">Add a new service to the public site.</p>
      <div className="mt-8">
        <ServiceForm action={createServiceAction} submitLabel="Create Service" />
      </div>
    </div>
  );
}
