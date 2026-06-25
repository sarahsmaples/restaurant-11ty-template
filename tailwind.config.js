/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.njk", "./src/**/*.html", "./src/**/*.md"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Bai Jamjuree', 'sans-serif'],
        eurostile: ['"eurostile"', 'sans-serif'],
      },
      colors: {
        'n-black':   '#0a0a0a',
        'n-surface': '#141414',
        'n-card':    '#1c1c1c',
        'n-border':  '#2a2a2a',
        'n-cream':   '#f0ebe3',
        'n-warm':    '#c8bfb5',
        'n-muted':   '#7a736b',
        'n-red':     '#c0392b',
        'n-red-dark':'#a93226',
        'n-gold':    '#c9a84c',
      },
    },
  },
  plugins: [],
};
