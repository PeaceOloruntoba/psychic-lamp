import { MapPin, Phone, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348057278058";

  return (
    <footer id="contact" className="border-t border-navy-700 bg-navy-950 py-16">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg font-bold text-white">VOZARO</p>
            <p className="text-sm text-slate-500">Global Resource Ltd.</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Our goal is to have the sun cover your electricity expenses —
              solar energy that&apos;s accessible and affordable for everyone.
            </p>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold text-white">Contact</p>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-solar-400" />
                Shop 10, Edjemuonyavwe Community, Oghara, Delta State
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-solar-400" />
                <a href={`https://wa.me/${whatsapp}`} className="hover:text-solar-400">
                  0805 727 8058 · 0706 464 8388
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold text-white">Company</p>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#services" className="hover:text-solar-400">Services</a></li>
              <li><a href="#products" className="hover:text-solar-400">Products</a></li>
              <li><a href="#books" className="hover:text-solar-400">Digital Books</a></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold text-white">Follow us</p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/vozaroglobalresourcelimited"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-700 text-slate-400 transition hover:border-solar-500 hover:text-solar-400"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com/vozaroglob"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-700 text-slate-400 transition hover:border-solar-500 hover:text-solar-400"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Vozaro Global Resource Limited. All rights reserved.</p>
          <p>RC 7265369 · Federal Republic of Nigeria</p>
        </div>
      </div>
    </footer>
  );
}
