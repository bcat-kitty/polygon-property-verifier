"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchProperty } from "@/lib/api";
import type { Property } from "@/lib/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isInteger(id) || id <= 0) {
      setError("Invalid property id");
      return;
    }
    fetchProperty(id)
      .then(setProperty)
      .catch((err: Error) => setError(err.message));
  }, [id]);

  return (
    <div>
      <Link
        href="/"
        className="text-sm text-slate-500 hover:text-slate-800 inline-block mb-4"
      >
        Back to properties
      </Link>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Failed to load property</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {!error && !property && (
        <p className="text-slate-500">Loading property...</p>
      )}

      {property && (
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3">
            {property.imageUrl && (
              <img
                src={property.imageUrl}
                alt={property.title}
                className="w-full h-80 object-cover rounded-xl border border-slate-200"
              />
            )}
            <h1 className="text-3xl font-bold text-slate-900 mt-6">
              {property.title}
            </h1>
            <p className="text-slate-500 mt-2">{property.address}</p>
            <p className="text-2xl font-semibold text-brand mt-4">
              {formatPrice(property.price)}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
