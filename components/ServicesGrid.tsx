import Image from "next/image";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Service } from "@/lib/types";
import { STOCK_IMAGES } from "@/lib/stock-images";

function resolveIcon(name: string): LucideIcon {
  const icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? Icons.Sun;
}

export default function ServicesGrid({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="bg-navy-900 py-20 sm:py-28">
      <div className="container-px mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 items-end gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              What we handle for you
            </h2>
            <p className="mt-3 max-w-lg text-slate-400">
              From first site visit to years of after-sales support — our
              team covers the full lifecycle of your renewable energy
              system.
            </p>
          </div>
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl border border-navy-700">
            <Image
              src={STOCK_IMAGES.aerialSolarField}
              alt="Aerial view of a renewable energy solar field"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
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
