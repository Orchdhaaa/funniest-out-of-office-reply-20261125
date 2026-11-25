import { writeFileSync, mkdirSync } from "node:fs";

// One-line out-of-office reply for make.fun's
// "Funniest One-Line Out-of-Office Reply".
// A real person switching this on before going away: they muted the
// inbox, the phone, and, for good measure, their sense of
// responsibility. The joke escalates from devices to conscience, and
// the punchline lands on the last word.
const LINE =
  "I am away until Monday. I have muted my inbox, my phone, and, for good measure, my sense of responsibility.";

// The entry gate accepts UTF-8 text of 1 to 140 characters that is not
// whitespace-only, so verify the line meets the gate before writing it.
// 140 is the tightest cap observed across the sibling out-of-office
// bounties (140, 159, 160, 280); this line is 107 characters, inside
// every one of them.
const chars = [...LINE].length;
if (chars < 1 || chars > 140 || LINE.trim().length === 0) {
  throw new Error(`line is ${chars} characters, outside the 1-140 gate`);
}

// The brief demands exactly one line: a line break would split the
// reply in two, so refuse anything that is not a single line.
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line");
}

// Every word earns its place: refuse a line where any single word is
// repeated four or more times, which is padding rather than a joke.
// The deliberate triple here ("my inbox, my phone, ... my sense of
// responsibility") is an escalation list, not padding, so the cap is
// four, not three.
const counts = new Map();
for (const word of LINE.toLowerCase().split(/[^a-z]+/).filter(Boolean)) {
  const n = (counts.get(word) ?? 0) + 1;
  if (n >= 4) {
    throw new Error(`word "${word}" repeats ${n} times`);
  }
  counts.set(word, n);
}

// An em dash would break the clean read-aloud rhythm the judge weighs,
// so refuse that too.
if (LINE.includes("\u2014") || LINE.includes("\u2013")) {
  throw new Error("line must not contain a dash");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, LINE, "utf8");
