const root: any = typeof window !== "undefined" ? window : globalThis;

function canParseHTMLNatively() {
  const Parser = root.DOMParser;
  let canParse = false;

  try {
    if (new Parser().parseFromString("", "text/html")) {
      canParse = true;
    }
  } catch (e) {}

  return canParse;
}

function createHTMLParser() {
  const Parser = function () {};

  if (typeof window !== "undefined") {
    if (shouldUseActiveX()) {
      (Parser as any).prototype.parseFromString = function (string: string) {
        const doc = new (window as any).ActiveXObject("htmlfile");
        doc.designMode = "on";
        doc.open();
        doc.write(string);
        doc.close();
        return doc;
      };
    } else {
      (Parser as any).prototype.parseFromString = function (string: string) {
        const doc = document.implementation.createHTMLDocument("");
        doc.open();
        doc.write(string);
        doc.close();
        return doc;
      };
    }
  } else {
    const domino = require("@mixmark-io/domino");
    (Parser as any).prototype.parseFromString = function (string: string) {
      return domino.createDocument(string);
    };
  }

  return Parser;
}

function shouldUseActiveX() {
  let useActiveX = false;
  try {
    document.implementation.createHTMLDocument("").open();
  } catch (e) {
    if ((root as any).ActiveXObject) useActiveX = true;
  }
  return useActiveX;
}

export default canParseHTMLNatively() ? root.DOMParser : createHTMLParser();
