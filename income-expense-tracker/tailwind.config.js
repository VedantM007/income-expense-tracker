/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Include all HTML and TypeScript files in the `src` directory
  ],
  theme: {
    extend: {
      screens: {
        'xs': { min:'300px' ,  max: '639px' }, // Targets devices less than 640px
      },
    },
  },

  plugins: [], // Add Tailwind plugins here
};
