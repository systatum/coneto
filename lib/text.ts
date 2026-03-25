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

type GenerateSentenceParams = {
  words?: string[];
  minLen?: number;
  maxLen?: number;
  seed?: number;
};

export function generateSentence({
  words = WORDS,
  minLen = 9,
  maxLen = 25,
  seed,
}: GenerateSentenceParams = {}): string {
  const random = seed !== undefined ? createSeededRandom(seed) : Math.random;

  const normalize = (w: string) => {
    const t = w.trim();
    if (t === ",") return ",";
    if (t === ".") return ".";
    return w;
  };

  const normalizedWords = words.map(normalize);

  const nonPunct = normalizedWords.filter((w) => w !== "," && w !== ".");
  const nonPeriod = normalizedWords.filter((w) => w !== ".");

  const length = Math.floor(random() * (maxLen - minLen + 1)) + minLen;

  const tokens = [];

  let prevComma = false;
  let prevPeriod = false;
  let wordsSincePeriod = 0;

  const recentWords = [];

  let lastWordLength = Infinity;

  const pickNonRepeat = (pool) => {
    let token;
    let attempts = 0;

    do {
      token = pool[Math.floor(random() * pool.length)];
      attempts++;

      if (attempts > 10) break;
    } while (
      token !== "," &&
      token !== "." &&
      (token === recentWords[recentWords.length - 1] ||
        token === recentWords[recentWords.length - 2])
    );

    return token;
  };

  for (let i = 0; i < length; i++) {
    let token;

    if (i === 0) {
      token = pickNonRepeat(nonPunct);
    } else if (prevComma) {
      token = pickNonRepeat(nonPunct);
    } else if (prevPeriod) {
      token = pickNonRepeat(nonPunct);
      token = token[0].toUpperCase() + token.slice(1);
    } else {
      const allowPeriod = wordsSincePeriod >= 4 && lastWordLength > 2;
      const allowComma = lastWordLength > 2;

      let pool;

      if (!allowPeriod && !allowComma) {
        pool = nonPunct;
      } else if (!allowPeriod) {
        pool = nonPeriod;
      } else if (!allowComma) {
        pool = normalizedWords.filter((w) => w !== ",");
      } else {
        pool = normalizedWords;
      }

      const a = pool[Math.floor(random() * pool.length)];
      const b = pool[Math.floor(random() * pool.length)];
      token = random() < 0.5 ? a : b;

      if (token === "." && prevPeriod) {
        token = nonPeriod[Math.floor(random() * nonPeriod.length)];
      }

      if (token !== "," && token !== ".") {
        token = pickNonRepeat(pool);
      }
    }

    tokens.push(token);

    if (token === ".") {
      prevPeriod = true;
      prevComma = false;
      wordsSincePeriod = 0;
      lastWordLength = Infinity;
    } else if (token === ",") {
      prevComma = true;
      prevPeriod = false;
      lastWordLength = Infinity;
    } else {
      prevComma = false;
      prevPeriod = false;
      wordsSincePeriod++;

      lastWordLength = token.length;

      recentWords.push(token);
      if (recentWords.length > 2) recentWords.shift();
    }
  }

  if (tokens[tokens.length - 1] === ",") {
    tokens[tokens.length - 1] = pickNonRepeat(nonPunct);
  }

  tokens[0] = tokens[0][0].toUpperCase() + tokens[0].slice(1);

  let sentence = tokens.join(" ");

  sentence = sentence.replace(/\s*,\s*/g, ", ").replace(/\s*\.\s*/g, ". ");

  sentence = sentence.trim();

  if (!sentence.endsWith(".")) {
    sentence += ".";
  }

  return sentence;
}

function createSeededRandom(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
