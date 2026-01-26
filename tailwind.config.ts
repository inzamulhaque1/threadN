import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        foreground: "#e2e8f0",
        card: "#12121a",
        "card-foreground": "#e2e8f0",
        primary: "#8b5cf6",
        "primary-foreground": "#ffffff",
        secondary: "#1e1e2e",
        "secondary-foreground": "#a1a1aa",
        muted: "#27272a",
        "muted-foreground": "#71717a",
        accent: "#06b6d4",
        "accent-foreground": "#ffffff",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        border: "#27272a",
        input: "#27272a",
        ring: "#8b5cf6",
        "neon-purple": "#8b5cf6",
        "neon-cyan": "#06b6d4",
        "neon-pink": "#ec4899",
      },
    },
  },
  plugins: [],
};

export default config;
