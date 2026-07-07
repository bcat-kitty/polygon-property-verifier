import { BrowserProvider, Contract, Eip1193Provider } from "ethers";
import { PROPERTY_VERIFIER_ABI } from "./PropertyVerifierAbi";

const AMOY_CHAIN_ID_HEX = "0x13882"; // 80002
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

declare global {
  interface Window {
    ethereum?: Eip1193Provider & {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export interface VerifyOnChainResult {
  txHash: string;
  blockNumber: number;
  contractAddress: string;
  polygonscanUrl: string;
}

async function ensureAmoyNetwork(): Promise<void> {
  const eth = window.ethereum;
  if (!eth) throw new Error("MetaMask not found");
  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: AMOY_CHAIN_ID_HEX }],
    });
  } catch (err: unknown) {
    const code = (err as { code?: number })?.code;
    if (code === 4902) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: AMOY_CHAIN_ID_HEX,
            chainName: "Polygon Amoy Testnet",
            nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
            rpcUrls: ["https://rpc-amoy.polygon.technology"],
            blockExplorerUrls: ["https://amoy.polygonscan.com"],
          },
        ],
      });
    } else {
      throw err;
    }
  }
}

export async function verifyOnChain(
  propertyHash: string,
  onSubmitted?: (txHash: string) => void
): Promise<VerifyOnChainResult> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error(
      "MetaMask not detected. Install the MetaMask browser extension and refresh."
    );
  }
  if (!CONTRACT_ADDRESS || !/^0x[0-9a-fA-F]{40}$/.test(CONTRACT_ADDRESS)) {
    throw new Error(
      "Contract address is not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS in frontend/.env.local after deploying the contract."
    );
  }
  if (!/^0x[0-9a-fA-F]{64}$/.test(propertyHash)) {
    throw new Error("Backend returned an invalid property hash format.");
  }

  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  await ensureAmoyNetwork();

  const signer = await provider.getSigner();
  const contract = new Contract(
    CONTRACT_ADDRESS,
    PROPERTY_VERIFIER_ABI,
    signer
  );

  const tx = await contract.verifyProperty(propertyHash);
  onSubmitted?.(tx.hash);

  const receipt = await tx.wait();
  if (!receipt) throw new Error("Transaction receipt missing");

  return {
    txHash: tx.hash,
    blockNumber: Number(receipt.blockNumber),
    contractAddress: CONTRACT_ADDRESS,
    polygonscanUrl: `https://amoy.polygonscan.com/tx/${tx.hash}`,
  };
}
