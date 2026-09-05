import Link from "next/link";
import { Sun } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-900 bg-grid-glow px-5 text-center">
      <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-solar-500/15">
        <Sun size={28} className="text-solar-400" />
      </span>
      <h1 className="font-display text-3xl font-bold text-white">Page not found</h1>
      <p className="mt-3 max-w-sm text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-solar-500 px-6 py-3 text-sm font-semibold text-navy-900 transition hover:bg-solar-400"
      >
        Back to homepage
      </Link>
    </div>
  );
}
