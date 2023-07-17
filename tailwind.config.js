/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      container: {
        center: true,
      },
      fontSize: {
        "4.5xl": "2.5rem",
      },
      cursor: {
        draw: 'url(../images/cursor/cursor-edit.svg) 2 22, auto'
      },
      colors: {
        gray: colors.neutral,
        // success: "#40C700",
        // warning: "#FF3E1D",
        primary: '#5551CE',
        primaryLight: '#A09DFF',
        cobaltBlue: '#5551CE',
        mediumGray: "#A1ACB8",
        dimGray: "#1A1B1C",
        purpleGray: "#F5F5F9",
        lightPurple: "#E9EAFF",
        white: "#FFFFFF",
        error: "#FF3E1D",
        success: "#40C700",
        warning: "#FF3E1D",
        disabled: "#EEF1F0",
        lightBlue: "#F2F5F9",
      },
      boxShadow: {
        'card': '0px 8px 24px rgba(39, 76, 119, 0.18)',
      },
      wordBreak: {
        'break-word': 'break-word',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};
