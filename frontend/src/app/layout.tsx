import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Property Verifier",
  description:
    "Verify property addresses on-chain with Polygon Amoy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
            <div className="text-xl font-bold tracking-wide text-slate-900">
              PROPERTY <span className="text-brand">VERIFIER</span>
            </div>
            <span className="text-sm text-slate-500">
              Polygon Amoy Testnet
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
        <footer className="border-t border-slate-200 mt-16 py-6 text-center text-sm text-slate-500">
          On-chain property verification on Polygon Amoy
        </footer>
      </body>
    </html>
  );
}
