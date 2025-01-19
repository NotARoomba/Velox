/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: { 'night': { DEFAULT: '#151515', 100: '#040404', 200: '#080808', 300: '#0c0c0c', 400: '#101010', 500: '#151515', 600: '#434343', 700: '#727272', 800: '#a1a1a1', 900: '#d0d0d0' }, 'celtic_blue': { DEFAULT: '#0074d9', 100: '#00172c', 200: '#002f58', 300: '#004684', 400: '#005eaf', 500: '#0074d9', 600: '#1692ff', 700: '#51aeff', 800: '#8bc9ff', 900: '#c5e4ff' }, 'pale_azure': { DEFAULT: '#89daff', 100: '#00364f', 200: '#006b9d', 300: '#00a1ec', 400: '#3bc1ff', 500: '#89daff', 600: '#a1e1ff', 700: '#b9e9ff', 800: '#d0f0ff', 900: '#e8f8ff' }, 'platinum': { DEFAULT: '#e8e8e8', 100: '#2e2e2e', 200: '#5d5d5d', 300: '#8b8b8b', 400: '#bababa', 500: '#e8e8e8', 600: '#ededed', 700: '#f1f1f1', 800: '#f6f6f6', 900: '#fafafa' } },
      //add a holographic effect with the celtic_blue
      boxShadow: { 'holo': '4px 4px #0074d9' },
      keyframes: {
        bouncepulse: {
          //red
          "0%": {
            "text-shadow": "0 0 rgb(255 69 58)",
            transform: "rotate(-3deg)",
          },
          "6.25%": { "text-shadow": "rgb(255 69 58)" },
          "12.5%": {
            "text-shadow": ".10em .10em rgb(255 69 58)",
            transform: "rotate(3deg)",
          },
          //orange
          "18.75%": { "text-shadow": "rgb(255 159 10)" },
          "25%": {
            "text-shadow": "0 0 rgb(255 159 10)",
            transform: "rotate(-3deg)",
          },
          "31.25%": { "text-shadow": "rgb(255 159 10)" },
          "37.5%": {
            "text-shadow": ".10em .10em rgb(255 159 10)",
            transform: "rotate(3deg)",
          },
          //yellow
          "43.75%": { "text-shadow": "rgb(255 214 10)" },
          "50%": {
            "text-shadow": "0 0 rgb(255 214 10)",
            transform: "rotate(-3deg)",
          },
          "56.25%": { "text-shadow": "rgb(255 214 10)" },
          "62.5%": {
            "text-shadow": ".10em .10em rgb(255 214 10)",
            transform: "rotate(3deg)",
          },
          //green
          "68.75%": { "text-shadow": "rgb(48 209 88)" },
          "75%": {
            "text-shadow": "0 0 rgb(48 209 88)",
            transform: "rotate(-3deg)",
          },
          "81.25%": { "text-shadow": "rgb(48 209 88)" },
          "87.5%": {
            "text-shadow": ".10em .10em rgb(48 209 88)",
            transform: "rotate(3deg)",
          },
          //blue
          "93.75%": { "text-shadow": "rgb(10 32 255)" },
          "100%": {
            "text-shadow": "0 0 rgb(10 32 255)",
            transform: "rotate(-3deg)",
          },
        },
        colorpulse: {
          //red
          "0%": { "text-shadow": "0 0 rgb(255 69 58)" },
          "6.25%": { "text-shadow": "rgb(255 69 58)" },
          "12.5%": { "text-shadow": ".10em .10em rgb(255 69 58)" },
          //orange
          "18.75%": { "text-shadow": "rgb(255 159 10)" },
          "25%": { "text-shadow": "0 0 rgb(255 159 10)" },
          "31.25%": { "text-shadow": "rgb(255 159 10)" },
          "37.5%": { "text-shadow": ".10em .10em rgb(255 159 10)" },
          //yellow
          "43.75%": { "text-shadow": "rgb(255 214 10)" },
          "50%": { "text-shadow": "0 0 rgb(255 214 10)" },
          "56.25%": { "text-shadow": "rgb(255 214 10)" },
          "62.5%": { "text-shadow": ".10em .10em rgb(255 214 10)" },
          //green
          "68.75%": { "text-shadow": "rgb(48 209 88)" },
          "75%": { "text-shadow": "0 0 rgb(48 209 88)" },
          "81.25%": { "text-shadow": "rgb(48 209 88)" },
          "87.5%": { "text-shadow": ".10em .10em rgb(48 209 88)" },
          //blue
          "93.75%": { "text-shadow": "rgb(10 32 255)" },
          "100%": { "text-shadow": "0 0 rgb(10 32 255)" },
        },
      },
      animation: {
        bouncepulse: "bouncepulse 12s ease-in-out infinite alternate",
        colorpulse: "colorpulse 6s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
} 

