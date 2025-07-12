import { _Lexer } from "./Lexer";
import { _Parser } from "./Parser";
import { _Tokenizer } from "./Tokenizer";
import { _Renderer } from "./Renderer";
import { _TextRenderer } from "./TextRenderer";
import { _Hooks } from "./Hooks";
import { Marked } from "./Instance";
import { _getDefaults, changeDefaults, _defaults } from "./defaults";
import type { MarkedExtension, MarkedOptions } from "./MarkedOptions";
import type { Token, TokensList } from "./Tokens";
import type { MaybePromise } from "./Instance";

const markedInstance = new Marked();

/**
 * Base function for compiling markdown to HTML
 */
function baseMarked(
  src: string,
  opt?: MarkedOptions | null
): string | Promise<string> {
  return markedInstance.parse(src, opt);
}

/**
 * Full marked object with attached utilities and methods
 */
const marked = Object.assign(baseMarked, {
  /**
   * Compiles markdown to HTML asynchronously.
   */
  async(
    src: string,
    options: MarkedOptions & { async: true }
  ): Promise<string> {
    return markedInstance.parse(src, options);
  },

  /**
   * Sets the default options.
   */
  options(options: MarkedOptions) {
    markedInstance.setOptions(options);
    marked.defaults = markedInstance.defaults;
    changeDefaults(marked.defaults);
    return marked;
  },

  /**
   * Alias for options()
   */
  setOptions(options: MarkedOptions) {
    markedInstance.setOptions(options);
    marked.defaults = markedInstance.defaults;
    changeDefaults(marked.defaults);
    return marked;
  },

  /**
   * Gets the original marked default options.
   */
  getDefaults: _getDefaults,

  /**
   * Current defaults in use.
   */
  defaults: _defaults,

  /**
   * Use extension(s)
   */
  use(...args: MarkedExtension[]) {
    markedInstance.use(...args);
    marked.defaults = markedInstance.defaults;
    changeDefaults(marked.defaults);
    return marked;
  },

  /**
   * Run callback for every token
   */
  walkTokens(
    tokens: Token[] | TokensList,
    callback: (token: Token) => MaybePromise | MaybePromise[]
  ) {
    return markedInstance.walkTokens(tokens, callback);
  },

  /**
   * Parse inline markdown (no enclosing <p> tag)
   */
  parseInline: markedInstance.parseInline,

  /**
   * Re-exports
   */
  Parser: _Parser,
  parser: _Parser.parse,
  Renderer: _Renderer,
  TextRenderer: _TextRenderer,
  Lexer: _Lexer,
  lexer: _Lexer.lex,
  Tokenizer: _Tokenizer,
  Hooks: _Hooks,
  parse: baseMarked,
});

// Export the full marked object
export { marked };
export default marked;

// Named re-exports for all internals
export const options = marked.options;
export const setOptions = marked.setOptions;
export const use = marked.use;
export const walkTokens = marked.walkTokens;
export const parseInline = marked.parseInline;
export const parse = marked;
export const parser = _Parser.parse;
export const lexer = _Lexer.lex;
export { _defaults as defaults, _getDefaults as getDefaults } from "./defaults";
export { _Lexer as Lexer } from "./Lexer";
export { _Parser as Parser } from "./Parser";
export { _Tokenizer as Tokenizer } from "./Tokenizer";
export { _Renderer as Renderer } from "./Renderer";
export { _TextRenderer as TextRenderer } from "./TextRenderer";
export { _Hooks as Hooks } from "./Hooks";
export { Marked } from "./Instance";
export type * from "./MarkedOptions";
export type * from "./Tokens";
