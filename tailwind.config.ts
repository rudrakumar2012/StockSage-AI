import type { Config } from "tailwindcss";

const config: Config = {
  // ... rest of config
  theme: {
    extend: {
      // ... rest of extend
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
};
export default config;