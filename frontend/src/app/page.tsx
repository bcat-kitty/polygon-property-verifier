"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProperties } from "@/lib/api";
import type { Property } from "@/lib/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function HomePage() {
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <p className="font-semibold">Failed to load properties</p>
        <p className="text-sm mt-1">{error}</p>
        <p className="text-sm mt-2">
          Make sure the backend is running on{" "}
          <code className="rounded bg-red-100 px-1">http://localhost:4000</code>.
        </p>
      </div>
    );
  }

  if (!properties) {
    return (
      <p className="text-slate-500">Loading properties...</p>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Properties</h1>
        <p className="text-slate-500 mt-1">
          Select a property to view details and verify its address on Polygon.
        </p>
      </div>

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <li
            key={p.id}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <Link href={`/properties/${p.id}`} className="block">
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="font-semibold text-slate-900">{p.title}</h2>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                  {p.address}
                </p>
                <p className="text-brand font-semibold mt-3">
                  {formatPrice(p.price)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
