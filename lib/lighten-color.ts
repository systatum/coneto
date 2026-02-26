export function lightenColor(color: string, percent: number) {
  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);

  const computed = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  const rgb = computed.match(/\d+/g);
  if (!rgb) return color;

  let [r, g, b] = rgb.map(Number);

  r = Math.min(255, Math.round(r + (255 - r) * percent));
  g = Math.min(255, Math.round(g + (255 - g) * percent));
  b = Math.min(255, Math.round(b + (255 - b) * percent));

  return `rgb(${r}, ${g}, ${b})`;
}
