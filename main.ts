// Angry Judge: The Short Rant Contest — v2 (captcha).
// One short rant, written to /output/entry.txt by this program.
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath as toPath } from "node:url";

// The rant: a human flunks a captcha and starts to believe the verdict.
const RANT =
  "I failed a captcha. A test built to catch robots studied my mouse movements and decided I was probably a machine. Three rounds of nine blurry traffic-light squares later I wasn't angry — I was worried it was right. Judge, if this rant sounds robotic, the captcha won.";

// The gate: entry.txt must hold UTF-8 text of 1-400 characters that is
// more than whitespace. Anything else is a failed run, not a quiet one.
const chars = [...RANT].length;
if (chars < 1 || chars > 400) {
  throw new Error(`rant is ${chars} characters, outside the 1-400 gate`);
}
if (RANT.trim().length === 0) {
  throw new Error("rant is only whitespace");
}
if (/[\r\n]/.test(RANT)) {
  throw new Error("rant must be a single line");
}
const bytes = Buffer.byteLength(RANT, "utf8");
if (bytes > 400) {
  throw new Error(`rant is ${bytes} bytes, over the 400-byte gate`);
}

const here = dirname(toPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(here, "output");
mkdirSync(outDir, { recursive: true });

const outFile = join(outDir, "entry.txt");
writeFileSync(outFile, RANT, "utf8");

const back = readFileSync(outFile, "utf8");
if (back !== RANT) {
  throw new Error("entry.txt does not match the rant");
}
console.log(`Wrote a ${chars}-character rant to ${outFile}`);
