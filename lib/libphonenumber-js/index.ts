// ---- CountryCode ----
// Extracted from libphonenumber-js types (MIT License)
export type CountryCode =
  | "AC"
  | "AD"
  | "AE"
  | "AF"
  | "AG"
  | "AI"
  | "AL"
  | "AM"
  | "AO"
  | "AR"
  | "AS"
  | "AT"
  | "AU"
  | "AW"
  | "AX"
  | "AZ"
  | "BA"
  | "BB"
  | "BD"
  | "BE"
  | "BF"
  | "BG"
  | "BH"
  | "BI"
  | "BJ"
  | "BL"
  | "BM"
  | "BN"
  | "BO"
  | "BQ"
  | "BR"
  | "BS"
  | "BT"
  | "BW"
  | "BY"
  | "BZ"
  | "CA"
  | "CC"
  | "CD"
  | "CF"
  | "CG"
  | "CH"
  | "CI"
  | "CK"
  | "CL"
  | "CM"
  | "CN"
  | "CO"
  | "CR"
  | "CU"
  | "CV"
  | "CW"
  | "CX"
  | "CY"
  | "CZ"
  | "DE"
  | "DJ"
  | "DK"
  | "DM"
  | "DO"
  | "DZ"
  | "EC"
  | "EE"
  | "EG"
  | "EH"
  | "ER"
  | "ES"
  | "ET"
  | "FI"
  | "FJ"
  | "FK"
  | "FM"
  | "FO"
  | "FR"
  | "GA"
  | "GB"
  | "GD"
  | "GE"
  | "GF"
  | "GG"
  | "GH"
  | "GI"
  | "GL"
  | "GM"
  | "GN"
  | "GP"
  | "GQ"
  | "GR"
  | "GT"
  | "GU"
  | "GW"
  | "GY"
  | "HK"
  | "HN"
  | "HR"
  | "HT"
  | "HU"
  | "ID"
  | "IE"
  | "IL"
  | "IM"
  | "IN"
  | "IO"
  | "IQ"
  | "IR"
  | "IS"
  | "IT"
  | "JE"
  | "JM"
  | "JO"
  | "JP"
  | "KE"
  | "KG"
  | "KH"
  | "KI"
  | "KM"
  | "KN"
  | "KP"
  | "KR"
  | "KW"
  | "KY"
  | "KZ"
  | "LA"
  | "LB"
  | "LC"
  | "LI"
  | "LK"
  | "LR"
  | "LS"
  | "LT"
  | "LU"
  | "LV"
  | "LY"
  | "MA"
  | "MC"
  | "MD"
  | "ME"
  | "MF"
  | "MG"
  | "MH"
  | "MK"
  | "ML"
  | "MM"
  | "MN"
  | "MO"
  | "MP"
  | "MQ"
  | "MR"
  | "MS"
  | "MT"
  | "MU"
  | "MV"
  | "MW"
  | "MX"
  | "MY"
  | "MZ"
  | "NA"
  | "NC"
  | "NE"
  | "NF"
  | "NG"
  | "NI"
  | "NL"
  | "NO"
  | "NP"
  | "NR"
  | "NU"
  | "NZ"
  | "OM"
  | "PA"
  | "PE"
  | "PF"
  | "PG"
  | "PH"
  | "PK"
  | "PL"
  | "PM"
  | "PR"
  | "PS"
  | "PT"
  | "PW"
  | "PY"
  | "QA"
  | "RE"
  | "RO"
  | "RS"
  | "RU"
  | "RW"
  | "SA"
  | "SB"
  | "SC"
  | "SD"
  | "SE"
  | "SG"
  | "SH"
  | "SI"
  | "SJ"
  | "SK"
  | "SL"
  | "SM"
  | "SN"
  | "SO"
  | "SR"
  | "SS"
  | "ST"
  | "SV"
  | "SX"
  | "SY"
  | "SZ"
  | "TA"
  | "TC"
  | "TD"
  | "TG"
  | "TH"
  | "TJ"
  | "TK"
  | "TL"
  | "TM"
  | "TN"
  | "TO"
  | "TR"
  | "TT"
  | "TV"
  | "TW"
  | "TZ"
  | "UA"
  | "UG"
  | "US"
  | "UY"
  | "UZ"
  | "VA"
  | "VC"
  | "VE"
  | "VG"
  | "VI"
  | "VN"
  | "VU"
  | "WF"
  | "WS"
  | "XK"
  | "YE"
  | "YT"
  | "ZA"
  | "ZM"
  | "ZW";

// ---- AsYouType ----
// Minimal implementation matching the API used in your phonebox component
export class AsYouType {
  private country: CountryCode;
  private inputValue: string = "";

  constructor(country: CountryCode = "ID") {
    this.country = country;
  }

  input(text: string): string {
    this.inputValue = text;
    return text;
  }

  getNumber(): { formatInternational: () => string } | undefined {
    const digits = this.inputValue.replace(/\D/g, "");
    if (!digits) return undefined;

    return {
      formatInternational: () => {
        const dialCode = DIAL_CODES[this.country] ?? "";
        const grouped = groupDigits(digits, this.country);
        return `+${dialCode} ${grouped}`;
      },
    };
  }
}

export const DIAL_CODES: Partial<Record<CountryCode, string>> = {
  AC: "247",
  AD: "376",
  AE: "971",
  AF: "93",
  AG: "1",
  AI: "1",
  AL: "355",
  AM: "374",
  AO: "244",
  AR: "54",
  AS: "1",
  AT: "43",
  AU: "61",
  AW: "297",
  AX: "358",
  AZ: "994",
  BA: "387",
  BB: "1",
  BD: "880",
  BE: "32",
  BF: "226",
  BG: "359",
  BH: "973",
  BI: "257",
  BJ: "229",
  BL: "590",
  BM: "1",
  BN: "673",
  BO: "591",
  BQ: "599",
  BR: "55",
  BS: "1",
  BT: "975",
  BW: "267",
  BY: "375",
  BZ: "501",
  CA: "1",
  CC: "61",
  CD: "243",
  CF: "236",
  CG: "242",
  CH: "41",
  CI: "225",
  CK: "682",
  CL: "56",
  CM: "237",
  CN: "86",
  CO: "57",
  CR: "506",
  CU: "53",
  CV: "238",
  CW: "599",
  CX: "61",
  CY: "357",
  CZ: "420",
  DE: "49",
  DJ: "253",
  DK: "45",
  DM: "1",
  DO: "1",
  DZ: "213",
  EC: "593",
  EE: "372",
  EG: "20",
  EH: "212",
  ER: "291",
  ES: "34",
  ET: "251",
  FI: "358",
  FJ: "679",
  FK: "500",
  FM: "691",
  FO: "298",
  FR: "33",
  GA: "241",
  GB: "44",
  GD: "1",
  GE: "995",
  GF: "594",
  GG: "44",
  GH: "233",
  GI: "350",
  GL: "299",
  GM: "220",
  GN: "224",
  GP: "590",
  GQ: "240",
  GR: "30",
  GT: "502",
  GU: "1",
  GW: "245",
  GY: "592",
  HK: "852",
  HN: "504",
  HR: "385",
  HT: "509",
  HU: "36",
  ID: "62",
  IE: "353",
  IL: "972",
  IM: "44",
  IN: "91",
  IO: "246",
  IQ: "964",
  IR: "98",
  IS: "354",
  IT: "39",
  JE: "44",
  JM: "1",
  JO: "962",
  JP: "81",
  KE: "254",
  KG: "996",
  KH: "855",
  KI: "686",
  KM: "269",
  KN: "1",
  KP: "850",
  KR: "82",
  KW: "965",
  KY: "1",
  KZ: "7",
  LA: "856",
  LB: "961",
  LC: "1",
  LI: "423",
  LK: "94",
  LR: "231",
  LS: "266",
  LT: "370",
  LU: "352",
  LV: "371",
  LY: "218",
  MA: "212",
  MC: "377",
  MD: "373",
  ME: "382",
  MF: "590",
  MG: "261",
  MH: "692",
  MK: "389",
  ML: "223",
  MM: "95",
  MN: "976",
  MO: "853",
  MP: "1",
  MQ: "596",
  MR: "222",
  MS: "1",
  MT: "356",
  MU: "230",
  MV: "960",
  MW: "265",
  MX: "52",
  MY: "60",
  MZ: "258",
  NA: "264",
  NC: "687",
  NE: "227",
  NF: "672",
  NG: "234",
  NI: "505",
  NL: "31",
  NO: "47",
  NP: "977",
  NR: "674",
  NU: "683",
  NZ: "64",
  OM: "968",
  PA: "507",
  PE: "51",
  PF: "689",
  PG: "675",
  PH: "63",
  PK: "92",
  PL: "48",
  PM: "508",
  PR: "1",
  PS: "970",
  PT: "351",
  PW: "680",
  PY: "595",
  QA: "974",
  RE: "262",
  RO: "40",
  RS: "381",
  RU: "7",
  RW: "250",
  SA: "966",
  SB: "677",
  SC: "248",
  SD: "249",
  SE: "46",
  SG: "65",
  SH: "290",
  SI: "386",
  SJ: "47",
  SK: "421",
  SL: "232",
  SM: "378",
  SN: "221",
  SO: "252",
  SR: "597",
  SS: "211",
  ST: "239",
  SV: "503",
  SX: "1",
  SY: "963",
  SZ: "268",
  TA: "290",
  TC: "1",
  TD: "235",
  TG: "228",
  TH: "66",
  TJ: "992",
  TK: "690",
  TL: "670",
  TM: "993",
  TN: "216",
  TO: "676",
  TR: "90",
  TT: "1",
  TV: "688",
  TW: "886",
  TZ: "255",
  UA: "380",
  UG: "256",
  US: "1",
  UY: "598",
  UZ: "998",
  VA: "39",
  VC: "1",
  VE: "58",
  VG: "1",
  VI: "1",
  VN: "84",
  VU: "678",
  WF: "681",
  WS: "685",
  XK: "383",
  YE: "967",
  YT: "262",
  ZA: "27",
  ZM: "260",
  ZW: "263",
};

// Per-country grouping patterns [firstGroup, secondGroup, thirdGroup...]
// Based on the most common national number formats
const GROUP_PATTERNS: Partial<Record<CountryCode, number[][]>> = {
  ID: [[3, 4, 4]],
  US: [[3, 3, 4]],
  CA: [[3, 3, 4]],
  GB: [
    [2, 4, 4],
    [3, 3, 4],
    [4, 3, 4],
    [5, 6],
  ],
  AU: [[3, 3, 3]],
  SG: [[4, 4]],
  MY: [
    [2, 3, 4],
    [3, 3, 3],
    [2, 4, 4],
  ],
  IN: [
    [5, 5],
    [4, 6],
  ],
  JP: [
    [2, 4, 4],
    [3, 3, 4],
    [1, 4, 4],
    [2, 3, 4],
    [3, 2, 4],
    [3, 3, 3],
  ],
  KR: [
    [2, 4, 4],
    [3, 3, 4],
  ],
  CN: [
    [3, 4, 4],
    [4, 3, 4],
  ],
  DE: [
    [3, 4, 4],
    [4, 3, 3],
    [5, 3, 3],
  ],
  FR: [
    [2, 2, 2, 2, 2],
    [3, 3, 2, 2],
  ],
  IT: [[3, 3, 4]],
  BR: [
    [5, 4],
    [5, 5],
    [2, 4, 4],
  ],
  MX: [[3, 3, 4]],
  RU: [
    [3, 3, 2, 2],
    [4, 3, 2, 2],
  ],
  SA: [[2, 3, 4]],
  AE: [[2, 3, 4]],
  PH: [[3, 3, 4]],
  PK: [[3, 3, 4]],
  BD: [[4, 3, 3]],
  NG: [[3, 3, 4]],
  ZA: [[2, 3, 4]],
  EG: [[2, 3, 4]],
  TH: [[2, 3, 4]],
  VN: [
    [3, 3, 3],
    [3, 3, 4],
  ],
  TR: [[3, 3, 4]],
  IR: [[3, 3, 4]],
  IQ: [[3, 3, 4]],
  AR: [[3, 3, 4]],
  CO: [[3, 3, 4]],
  ES: [
    [3, 3, 3],
    [3, 2, 2, 2],
  ],
  NL: [[2, 4, 3]],
  PL: [
    [3, 3, 3],
    [2, 3, 3, 3],
  ],
  SE: [[2, 3, 2, 2]],
  NO: [[3, 2, 3]],
  DK: [[2, 2, 2, 2]],
  FI: [[2, 3, 2, 2]],
  CH: [[3, 3, 2, 2]],
  AT: [[3, 4, 4]],
  BE: [[3, 2, 2, 2]],
  PT: [[3, 3, 3]],
  NZ: [[2, 3, 4]],
  HK: [[4, 4]],
  TW: [[4, 3, 3]],
};

export function groupDigits(digits: string, country: CountryCode): string {
  const patterns = GROUP_PATTERNS[country];
  if (!patterns) return digits;

  // Find a pattern whose total length matches the input
  const matched = patterns.find(
    (p) => p.reduce((a, b) => a + b, 0) === digits.length
  );

  if (!matched) return digits; // no match → no dashes

  const groups: string[] = [];
  let pos = 0;
  for (const size of matched) {
    groups.push(digits.slice(pos, pos + size));
    pos += size;
  }

  return groups.join(" ");
}
