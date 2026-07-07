"use client";

import { useState } from "react";
import { verifyPropertyHash } from "@/lib/api";
import { verifyOnChain } from "@/lib/verifyProperty";

type Status =
  | { kind: "idle" }
  | { kind: "hashing" }
  | { kind: "signing"; propertyHash: string }
  | { kind: "mining"; propertyHash: string; txHash: string }
  | {
      kind: "success";
      propertyHash: string;
      txHash: string;
      blockNumber: number;
      polygonscanUrl: string;
    }
  | { kind: "error"; message: string };

export default function VerifyPropertyButton({
  propertyId,
}: {
  propertyId: number;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const busy =
    status.kind === "hashing" ||
    status.kind === "signing" ||
    status.kind === "mining";

  async function handleClick() {
    setStatus({ kind: "hashing" });
    try {
      const backendRes = await verifyPropertyHash(propertyId);
      setStatus({ kind: "signing", propertyHash: backendRes.propertyHash });

      const result = await verifyOnChain(
        backendRes.propertyHash,
        (txHash) =>
          setStatus({
            kind: "mining",
            propertyHash: backendRes.propertyHash,
            txHash,
          })
      );

      setStatus({
        kind: "success",
        propertyHash: backendRes.propertyHash,
        txHash: result.txHash,
        blockNumber: result.blockNumber,
        polygonscanUrl: result.polygonscanUrl,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err && "message" in err
          ? String((err as { message: unknown }).message)
          : "Unknown error";
      setStatus({ kind: "error", message });
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleClick}
        disabled={busy}
        className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {status.kind === "hashing" && "Hashing address..."}
        {status.kind === "signing" && "Waiting for signature..."}
        {status.kind === "mining" && "Confirming on Polygon..."}
        {(status.kind === "idle" ||
          status.kind === "success" ||
          status.kind === "error") &&
          "Verify Property"}
      </button>

      {status.kind === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <p className="font-semibold">Verification failed</p>
          <p className="mt-1 break-words">{status.message}</p>
        </div>
      )}

      {status.kind === "mining" && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          <p className="font-semibold">Transaction submitted</p>
          <p className="mt-1 break-all font-mono text-xs">{status.txHash}</p>
          <p className="mt-1 text-xs">Waiting for confirmation...</p>
        </div>
      )}

      {status.kind === "success" && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900 space-y-2">
          <p className="font-semibold">Verified on Polygon Amoy</p>
          <div>
            <div className="text-xs text-green-700 mt-1">Property hash</div>
            <div className="break-all font-mono text-xs">
              {status.propertyHash}
            </div>
          </div>
          <div>
            <div className="text-xs text-green-700">Tx hash</div>
            <div className="break-all font-mono text-xs">{status.txHash}</div>
          </div>
          <div className="text-xs text-green-700">
            Block #{status.blockNumber}
          </div>
          <a
            href={status.polygonscanUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
          >
            View on Polygonscan
          </a>
        </div>
      )}

      {status.kind === "signing" && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
          <p className="font-semibold">Approve in MetaMask</p>
          <p className="mt-1 text-xs break-all">
            Hash to record: <span className="font-mono">{status.propertyHash}</span>
          </p>
        </div>
      )}
    </div>
  );
}
