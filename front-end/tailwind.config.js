/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      minHeight: {
        14: "3.5rem",
        32: "31rem",
      },
    },
  },
  plugins: [],
};
