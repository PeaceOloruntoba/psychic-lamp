"use client";

import { Sun, ShieldCheck, Zap } from "lucide-react";
import { useOrderModal } from "./OrderModalContext";

export default function Hero() {
  const { openOrderModal } = useOrderModal();

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-navy-900 bg-grid-glow pb-24 pt-32 sm:pb-32 sm:pt-40"
    >
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="container-px relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mb-5 text-sm font-medium text-solar-400">
              Solar · Inverters · Electrical · CCTV — Oghara, Delta State
            </p>
            <h1 className="text-balance font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              Light wey no dey fail.
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-slate-400">
              We design, supply, and install solar and inverter systems that
              keep your home or business running — collaborating with
              manufacturers across China, Canada, India, and Germany to bring
              you dependable power, built to last.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => openOrderModal()}
                className="rounded-full bg-solar-500 px-7 py-3.5 text-sm font-semibold text-navy-900 transition hover:bg-solar-400"
              >
                Book Installation
              </button>
              <a
                href="#products"
                className="rounded-full border border-navy-700 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:border-solar-500 hover:text-solar-400"
              >
                View Solar Products
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-500">
              <span>Nationwide installation</span>
              <span className="h-1 w-1 rounded-full bg-navy-700" />
              <span>Genuine components</span>
              <span className="h-1 w-1 rounded-full bg-navy-700" />
              <span>After-sales maintenance</span>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-square max-w-md rounded-[2rem] border border-navy-700 bg-navy-800/60 p-8 shadow-glow">
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-solar-500/15">
                  <Sun size={40} className="text-solar-400" />
                </span>
                <p className="font-display text-2xl font-semibold text-white">
                  Powering homes &amp; businesses
                </p>
                <p className="text-sm text-slate-400">
                  Solar panels · Inverters · Battery banks
                </p>
              </div>

              <FloatingCard
                icon={<Zap size={16} className="text-solar-400" />}
                label="Fast turnaround"
                value="Site visit within 48hrs"
                className="-left-6 top-8 hidden sm:flex"
              />
              <FloatingCard
                icon={<ShieldCheck size={16} className="text-amber-400" />}
                label="Warranty backed"
                value="Genuine parts, real support"
                className="-right-6 bottom-10 hidden sm:flex"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingCard({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div
      className={`absolute w-48 items-center gap-3 rounded-xl border border-navy-700 bg-navy-900/95 p-3.5 shadow-lg transition hover:-translate-y-1 ${className}`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-800">
        {icon}
      </span>
      <span className="ml-3 inline-block">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xs font-semibold text-white">{value}</p>
      </span>
    </div>
  );
}
