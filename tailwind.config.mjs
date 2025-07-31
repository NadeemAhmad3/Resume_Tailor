// tailwind.config.mjs
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Use only the simple color formats that html2canvas supports
        slate: colors.slate,
        gray: colors.gray,
        zinc: colors.zinc,
        neutral: colors.neutral,
        stone: colors.stone,
        blue: colors.blue,
        purple: colors.purple,
        pink: colors.pink,
        indigo: colors.indigo,
        red: colors.red,
      },
    },
  },
  plugins: [],
};

export default config;