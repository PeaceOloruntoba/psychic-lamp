import Image from "next/image";
import { BookOpen, CheckCircle2, ExternalLink } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import type { Product } from "@/lib/types";

export default function DigitalBookPreview({ books }: { books: Product[] }) {
  if (books.length === 0) return null;

  return (
    <section id="books" className="bg-navy-900 py-20 sm:py-28">
      <div className="container-px mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Digital guides &amp; ebooks
          </h2>
          <p className="mt-3 text-slate-400">
            Practical resources on solar energy, straight from our field
            experience — delivered instantly.
          </p>
        </div>

        <div className="space-y-8">
          {books.map((book) => {
            const takeaways = book.description
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
              .slice(0, 5);

            return (
              <div
                key={book.id}
                className="grid grid-cols-1 gap-8 rounded-2xl border border-navy-700 bg-navy-800/50 p-6 sm:p-8 lg:grid-cols-[280px_1fr]"
              >
                <div className="relative aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-xl bg-navy-900">
                  {book.images?.[0] ? (
                    <Image
                      src={book.images[0]}
                      alt={book.title}
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-navy-700">
                      <BookOpen size={40} />
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="mb-2 w-fit rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-400">
                    Digital Book
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-white">
                    {book.title}
                  </h3>

                  {takeaways.length > 0 && (
                    <ul className="mt-5 space-y-2.5">
                      {takeaways.map((point, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-solar-400" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <span className="font-display text-xl font-semibold text-solar-400">
                      {formatNaira(book.price)}
                    </span>
                    {book.selar_url ? (
                      <a
                        href={book.selar_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-solar-500 px-6 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-solar-400"
                      >
                        Get it on Selar <ExternalLink size={15} />
                      </a>
                    ) : (
                      <span className="text-sm text-slate-500">Coming soon</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
