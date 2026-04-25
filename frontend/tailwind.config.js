/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'nyu-violet': '#57068C',
        'nyu-violet-light': '#7B2FBE',
        'nyu-violet-dark': '#3D0462',
      },
    },
  },
  plugins: [],
}
