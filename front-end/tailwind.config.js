/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      minHeight: {
        14: "3.5rem",
        32: "32rem",
        44: "44rem",
      },
      minWidth: {
        3: "0.75rem",
      },
    },
  },
  plugins: [],
};
