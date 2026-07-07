import * as fs from "node:fs";
import * as path from "node:path";

const artifactPath = path.join(
  __dirname,
  "..",
  "artifacts",
  "contracts",
  "PropertyVerifier.sol",
  "PropertyVerifier.json"
);

const outPath = path.join(
  __dirname,
  "..",
  "..",
  "frontend",
  "src",
  "lib",
  "PropertyVerifierAbi.ts"
);

function main() {
  if (!fs.existsSync(artifactPath)) {
    console.error("Artifact not found. Run `npx hardhat compile` first.");
    process.exit(1);
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const abi = artifact.abi;

  const body =
    "// AUTO-GENERATED FILE. Do not edit by hand.\n" +
    "// Regenerate with `npm run export-abi` in the contracts package.\n\n" +
    "export const PROPERTY_VERIFIER_ABI = " +
    JSON.stringify(abi, null, 2) +
    " as const;\n";

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, body);
  console.log("Wrote", outPath, `(${abi.length} entries)`);
}

main();
