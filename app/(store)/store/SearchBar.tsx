"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SearchHit {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // ponytail: debounced fetch — 300ms, cancels previous
  useEffect(() => {
    if (!query.trim()) {
      setHits([]);
      setOpen(false);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=5`,
        );
        const data = await res.json();
        setHits(data.hits || []);
        setOpen(true);
      } catch {
        setHits([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);

    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (open) {
          setOpen(false);
        } else {
          setQuery("");
          ref.current?.querySelector("input")?.blur();
        }
      }
    };
    document.addEventListener("keydown", escape);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const goToResults = () => {
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/store/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={ref} className="relative max-w-sm">
      <input
        id="search-bar"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && goToResults()}
        onFocus={() => hits.length > 0 && setOpen(true)}
        placeholder="Search products..."
        className=" rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
      />
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-400">Searching...</div>
          )}
          {!loading && hits.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-400">
              No results found
            </div>
          )}
          {hits.map((hit) => (
            <button
              key={hit.id}
              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => {
                setOpen(false);
                router.push(`/store/product/${hit.id}`);
              }}
            >
              {hit.image ? (
                <Image
                  src={hit.image}
                  alt={hit.name}
                  width={36}
                  height={36}
                  className="rounded object-cover size-9 flex-shrink-0"
                />
              ) : (
                <div className="size-9 rounded bg-gray-100 flex-shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{hit.name}</div>
                <div className="text-xs text-gray-400">{hit.category}</div>
              </div>
              <div className="ml-auto text-sm font-semibold text-green-600 flex-shrink-0">
                ${hit.price.toFixed(2)}
              </div>
            </button>
          ))}
          {hits.length > 0 && (
            <button
              className="w-full border-t border-gray-100 px-4 py-2 text-center text-sm text-green-600 hover:bg-gray-50 transition-colors font-medium cursor-pointer"
              onClick={goToResults}
            >
              View all results for &quot;{query}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
