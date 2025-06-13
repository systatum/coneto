export function getCode(str: string): number {
  let code = 0;
  for (const char of str) {
    code += char.codePointAt(0) ?? 0;
  }
  return code;
}

export function strToColor(str: string, colorSpace: string[]): string {
  const code = getCode(str);

  const pos = code % colorSpace.length;
  return colorSpace[pos];
}
