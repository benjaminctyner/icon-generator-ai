import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "Bens-Blue": "#111827",
      },
    },
  },
  plugins: [],
} satisfies Config;
