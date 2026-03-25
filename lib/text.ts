const WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "forte",
  "amet",
  "sic",
  "edispicit",
  "ego",
  ".",
  "sum",
  ", ",
  ".",
  "minim",
  "eiusmod",
  "temper",
  "labore",
  "et",
  "duis",
  "est",
  "id",
  ", ",
  "nummifer",
  ".",
  "Asianus",
  "ab",
  "conditum",
  "divitis",
  "minor",
  "quis",
  "nostrud",
  "incididunt",
  "sed",
  "proident",
  "sunt",
  "Romana",
  "Jacarta",
  "Palaestinae",
  "sigilum",
  ".",
  ",",
  ".",
  "Massachusetta",
  ".",
  "Republicae",
  "Therania",
  "res",
  "officia",
  ",",
  "exercitation",
  "nisi",
  "ex",
  "veritas",
  ", ",
  "magna",
  "diversus",
  ".",
  "factum",
  "fides",
  "intra",
  "nil",
  "nobilis",
  "potis",
  "quia",
  "sanus",
  "tertius",
  "vox",
  "urbis",
  ", ",
  "alii",
  "non",
  "feugiat",
  ".",
  "libero",
  "a",
  "viverra",
  "consequat",
  "lacus",
  "mi",
  "laoreet",
  ".",
  "enim",
  "at",
  ".",
  "tristique",
  "velit",
  "quam",
  "a",
  "urna",
  ".",
  ",",
  "suspendisse",
  "potenti",
  "in",
  "hac",
  ".",
  "habitasse",
  "platea",
  "dictumst",
  "proin",
  "vel",
  "justo",
  "ac",
  "mauris",
  "laoreet",
  ".",
  "sagittis",
  "acerbus",
  "aetas",
  "altia",
  "animus",
  "ars",
  "audax",
  "quaestor",
  "manus",
  "brevum",
  "candidus",
  "forum",
  "orbis",
  "anno",
  "decus",
  "dignitas",
  "durus",
  "pax",
  "porta",
  "salus",
  "fortis",
  ".",
  "gravis",
  "ignis",
  "terra",
  "vita",
  "longus",
  "magnus",
  "malus",
  "novum",
  ".",
  "parvus",
  "plenus",
  ".",
  "princeps",
  "statio",
  ".",
  "numen",
  ".",
  "lux",
  "mater",
  ".",
  ",",
  "scientia",
  "Islamica",
  "epistola",
  "civitas",
  "academica",
  "curiae",
  "industria",
  ".",
  "memoria",
  ",",
  "credo",
  "rego",
  "arena",
  "columna",
  ".",
  ",",
  ".",
  "rex",
  "bene",
  ".",
  ",",
  "litterae",
  "studium",
  "regio",
  "humilis",
  "ius",
  "viderem",
  "cum",
  ",",
  "vidi",
  "circum",
  "frixum",
  "quasi",
  "non",
  "non",
  ".",
  "esset",
  ".",
  "vestibulum",
  "ex",
  "sed",
];

export function generateSentence({
  words = WORDS,
  minLen = 9,
  maxLen = 25,
  seed,
}: Partial<{
  words?: string[];
  minLen?: number;
  maxLen?: number;
  seed?: number;
}> = {}) {
  let random = Math.random;
  if (typeof seed === "number") {
    // Simple deterministic PRNG (Mulberry32)
    let s = seed;
    random = () => {
      s |= 0;
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const normalizedWords = words.map((w) => (w.trim() === "," ? "," : w));
  const nonComma = normalizedWords.filter((w) => w !== ",");
  const length = Math.floor(random() * (maxLen - minLen + 1)) + minLen;

  const tokens = [];
  let prevComma = false;

  for (let i = 0; i < length; i++) {
    let token;
    if (i === 0) {
      token = nonComma[Math.floor(random() * nonComma.length)];
    } else if (prevComma) {
      token = nonComma[Math.floor(random() * nonComma.length)];
    } else {
      const a = normalizedWords[Math.floor(random() * normalizedWords.length)];
      const b = normalizedWords[Math.floor(random() * normalizedWords.length)];
      token = random() < 0.5 ? a : b;
    }
    tokens.push(token);
    prevComma = token === ",";
  }

  if (tokens[tokens.length - 1] === ",") {
    tokens[tokens.length - 1] =
      nonComma[Math.floor(random() * nonComma.length)];
  }

  tokens[0] = tokens[0][0].toUpperCase() + tokens[0].slice(1);

  let sentence = tokens.join(" ");
  sentence = sentence.replace(/\s*,\s*/g, ", ");
  sentence += ".";
  return sentence;
}
