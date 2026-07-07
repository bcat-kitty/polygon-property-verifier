// AUTO-GENERATED FILE. Do not edit by hand.
// Regenerate with `npm run export-abi` in the contracts package.

export const PROPERTY_VERIFIER_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "propertyHash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "verifier",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "PropertyVerified",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "propertyHash",
        "type": "bytes32"
      }
    ],
    "name": "verifyProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
