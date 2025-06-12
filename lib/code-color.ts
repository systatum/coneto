export function getCode(fullname: string): number {
  let code = 0;
  for (const char of fullname) {
    code += char.codePointAt(0) ?? 0;
  }
  return code;
}

export function getBackground(code: number, backgroundColor: string[]): string {
  const pos = code % backgroundColor.length;
  return backgroundColor[pos];
}
