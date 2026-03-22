import type { Config } from "tailwindcss";

const config: Config = {
  // ... rest of config
  theme: {
    extend: {
      // ... rest of extend
      animation: {
        'warp-speed': 'warp-speed 3s linear infinite',
      },
      keyframes: {
        'warp-speed': {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '0.1' },
          '50%': { transform: 'scale(1.1) rotate(1deg)', opacity: '0.15' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.1' },
        },
      },
    },
  },
};
export default config;