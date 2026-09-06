import Image from "next/image";
import { Globe2, Target, Eye } from "lucide-react";
import { STOCK_IMAGES } from "@/lib/stock-images";

export default function About() {
  return (
    <section id="about" className="bg-navy-950 py-20 sm:py-28">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-navy-700 sm:aspect-[5/4]">
              <Image
                src={STOCK_IMAGES.technicianInstalling}
                alt="Technician installing a solar panel on a rooftop"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
            </div>
          </div>

          <div className="lg:col-span-6">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-solar-500/15 px-3 py-1 text-xs font-medium text-solar-400">
              <Globe2 size={14} /> About Vozaro
            </span>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              A renewable energy company built for the long term
            </h2>
            <p className="mt-5 text-slate-400">
              Vozaro Global Resource Limited (RC 7265369) is a leading
              renewable energy company collaborating with solar
              manufacturers across China, Canada, India, and Germany to
              deliver top-notch solar solutions worldwide. We strive for
              innovation, empowerment, and the delivery of dependable clean
              power — from first consultation to years of after-sales
              support.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-solar-500/15 text-solar-400">
                  <Eye size={20} />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-white">Our Vision</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Our goal is to have the sun cover our electricity
                    expenses, allowing us to save and plan for a brighter
                    future.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                  <Target size={20} />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-white">Our Mission</p>
                  <p className="mt-1 text-sm text-slate-400">
                    We aim for a future where renewable energy is accessible
                    and affordable for everyone — one home, one business, one
                    community at a time.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500">
              <span>RC 7265369</span>
              <span className="h-1 w-1 rounded-full bg-navy-700" />
              <span>Incorporated Dec 2023</span>
              <span className="h-1 w-1 rounded-full bg-navy-700" />
              <span>Oghara, Delta State</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
