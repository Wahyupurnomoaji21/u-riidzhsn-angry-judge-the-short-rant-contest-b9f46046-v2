// Angry Judge: The Short Rant Contest — u-riidzhsn-angry-judge-the-short-rant-contest-b9f46046
// Writes one short, funny rant about an everyday annoyance to /output/entry.txt:
// a human failing a captcha — a robot test that decides a real person is
// probably a machine, and the human starting to worry it is right.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY_TEXT =
  "I failed a captcha. A test built to catch robots studied my mouse movements and decided I was probably a machine. Three rounds of nine blurry traffic-light squares later I wasn't angry — I was worried it was right. Judge, if this rant sounds robotic, the captcha won.";

// Gate self-check (competition.yaml): UTF-8 text, 1–400 chars, not only
// whitespace — fail loudly instead of writing a bad entry. The rant below
// is 267 chars / 269 bytes (the em dash is 3 bytes in UTF-8), one line,
// comfortably inside the gate.
if (ENTRY_TEXT.length < 1 || ENTRY_TEXT.length > 400) {
  throw new Error(`Entry is ${ENTRY_TEXT.length} chars, outside the 1–400 gate`);
}
if (!/\S/.test(ENTRY_TEXT)) {
  throw new Error("Entry is only whitespace");
}
if (ENTRY_TEXT.includes("\r")) {
  throw new Error("Entry must not contain a carriage return");
}
if (Buffer.byteLength(ENTRY_TEXT, "utf8") > 400) {
  throw new Error(`Entry is ${Buffer.byteLength(ENTRY_TEXT, "utf8")} bytes, over the 400-byte gate`);
}

const repoDir = dirname(fileURLToPath(import.meta.url));
const outputDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? join(repoDir, "output");
mkdirSync(outputDir, { recursive: true });

const entryPath = join(outputDir, "entry.txt");
writeFileSync(entryPath, ENTRY_TEXT, "utf8");

// Read back and confirm the file is byte-identical to what we intended.
const written = readFileSync(entryPath, "utf8");
if (written !== ENTRY_TEXT) {
  throw new Error("Read-back mismatch: entry.txt differs from intended text");
}
console.log(`Wrote ${ENTRY_TEXT.length} chars to ${entryPath}`);
