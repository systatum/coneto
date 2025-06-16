/** @type {import('tailwindcss').Config} */

const gridColCounts = Array.from({ length: 12 }, (_, i) => i + 1);
const breakpoints = ["", "sm", "md", "lg", "xl"];

module.exports = {
  content: [
    "./.storybook/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    ...breakpoints.flatMap((bp) =>
      gridColCounts.map((col) =>
        bp ? `${bp}:grid-cols-${col}` : `grid-cols-${col}`
      )
    ),
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
        16: "repeat(16, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
