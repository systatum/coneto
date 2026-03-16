// Array of words including some commas
export const WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "forte",
  "amet",
  "sic",
  "edispicit",
  "ego",
  "sum",
  ", ",
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
  "Sigilum",
  "Massachusetta",
  "Republicae",
  "Therania",
  "res",
  "officia",
  "exercitation",
  "nisi",
  "ex",
  "veritas",
  ", ",
  "magna",
  "diversus",
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
];

export function generateSentence(words, minLen = 9, maxLen = 25) {
  // Normalize commas: strip spaces around comma strings
  const normalizedWords = words.map((w) => (w.trim() === "," ? "," : w));
  // Create array excluding commas for selection after a comma or first word
  const nonComma = normalizedWords.filter((w) => w !== ",");
  // Random sentence length between minLen and maxLen
  const length = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;

  const tokens = [];
  let prevComma = false;

  for (let i = 0; i < length; i++) {
    let token;

    if (i === 0) {
      // First word must not be a comma
      token = nonComma[Math.floor(Math.random() * nonComma.length)];
    } else if (prevComma) {
      // Word after comma must be non-comma
      token = nonComma[Math.floor(Math.random() * nonComma.length)];
    } else {
      // Otherwise, any word (including comma) can be selected using double-randomness
      const a =
        normalizedWords[Math.floor(Math.random() * normalizedWords.length)];
      const b =
        normalizedWords[Math.floor(Math.random() * normalizedWords.length)];
      token = Math.random() < 0.5 ? a : b;
    }

    tokens.push(token);
    prevComma = token === ",";
  }

  // Ensure sentence does not end with a comma
  if (tokens[tokens.length - 1] === ",") {
    tokens[tokens.length - 1] =
      nonComma[Math.floor(Math.random() * nonComma.length)];
  }

  // Capitalize first word
  tokens[0] = tokens[0][0].toUpperCase() + tokens[0].slice(1);

  // Join tokens with spaces, normalize commas: no space before, one space after
  let sentence = tokens.join(" ");
  sentence = sentence.replace(/\s*,\s*/g, ", ");
  sentence += "."; // terminate with period

  return sentence;
}
