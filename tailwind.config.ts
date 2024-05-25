import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
        
        "primary": "#6440ff",
                
        "primary-content": "#daddff",
                
        "secondary": "#006dff",
                
        "secondary-content": "#000416",
                
        "accent": "#0000ff",
                
        "accent-content": "#c6dbff",
                
        "neutral": "#070707",
                
        "neutral-content": "#c6c6c6",
                
        "base-100": "#252435",
                
        "base-200": "#1f1e2d",
                
        "base-300": "#191825",
                
        "base-content": "#ceced3",
                
        "info": "#00e2ff",
                
        "info-content": "#001216",
                
        "success": "#719e00",
                
        "success-content": "#040900",
                
        "warning": "#ff9300",
                
        "warning-content": "#160800",
                
        "error": "#cc001b",
                
        "error-content": "#fcd6d1",
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
export default config;
