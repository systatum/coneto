import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";

let initialized = false;

function initMonacoEnvironment() {
  if (initialized || typeof window === "undefined") return;

  (window as any).MonacoEnvironment = {
    getWorker(_: unknown, label: string) {
      if (label === "json") return new JsonWorker();
      if (label === "css" || label === "scss" || label === "less")
        return new CssWorker();
      if (label === "html") return new HtmlWorker();
      if (label === "typescript" || label === "javascript")
        return new TsWorker();
      return new EditorWorker();
    },
  };

  initialized = true;
}

import {
  languages,
  Uri,
  KeyCode,
  editor,
} from "monaco-editor/esm/vs/editor/editor.api";

export { languages, Uri, KeyCode, initMonacoEnvironment, editor };
