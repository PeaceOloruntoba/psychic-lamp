import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Service } from "@/lib/types";

function resolveIcon(name: string): LucideIcon {
  const icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? Icons.Sun;
}

export default function ServicesGrid({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="bg-navy-900 py-20 sm:py-28">
      <div className="container-px mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            What we handle for you
          </h2>
          <p className="mt-3 text-slate-400">
            From first site visit to years of after-sales support — our team
            covers the full lifecycle of your power system.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = resolveIcon(service.icon_name);
            return (
              <div
                key={service.id}
                className="group rounded-2xl border border-navy-700 bg-navy-800/50 p-6 transition hover:border-solar-500/40 hover:bg-navy-800"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-solar-500/15 transition group-hover:bg-solar-500/25">
                  <Icon size={22} className="text-solar-400" />
                </span>
                <h3 className="font-display text-lg font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
