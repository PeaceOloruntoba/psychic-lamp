"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useOrderModal } from "./OrderModalContext";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "Digital Books", href: "#books" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openOrderModal } = useOrderModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled ? "bg-navy-900/90 backdrop-blur border-b border-navy-700" : "bg-transparent"
      }`}
    >
      <nav className="container-px mx-auto flex h-16 max-w-7xl items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white p-1">
            <Image src="/images/logo.jpg" alt="Vozaro Global Resource logo" width={32} height={32} className="h-full w-full object-contain" />
          </span>
          <span className="font-display text-base font-bold tracking-tight text-white">
            VOZARO
            <span className="ml-1 text-xs font-medium text-slate-400">GLOBAL RESOURCE</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-slate-300 transition hover:text-solar-400"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <button
            onClick={() => openOrderModal()}
            className="rounded-full bg-solar-500 px-5 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-solar-400"
          >
            Book Installation
          </button>
        </div>

        <button
          className="p-2 text-white md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-navy-700 bg-navy-900 md:hidden">
          <div className="container-px mx-auto flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-navy-800 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMenuOpen(false);
                openOrderModal();
              }}
              className="mt-2 rounded-full bg-solar-500 px-5 py-3 text-sm font-semibold text-navy-900"
            >
              Book Installation
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
