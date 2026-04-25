/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        // NYU Primary
        'nyu-violet':       '#57068c',
        'nyu-ultra-violet': '#8900e1',
        'nyu-black':        '#000000',

        // NYU Secondary (violet scale)
        'nyu-deep-violet':     '#330662',
        'nyu-medium-violet-1': '#702b9d',
        'nyu-medium-violet-2': '#7b5aa6',
        'nyu-light-violet-1':  '#ab82c5',
        'nyu-light-violet-2':  '#eee6f3',

        // NYU Neutral
        'nyu-white':      '#ffffff',
        'nyu-light-gray': '#f2f2f2',
        'nyu-gray-3':     '#d6d6d6',
        'nyu-gray-2':     '#b8b8b8',
        'nyu-gray-1':     '#6d6d6d',
        'nyu-dark-gray':  '#404040',

        // NYU Accent
        'nyu-teal':    '#009b8a',
        'nyu-blue':    '#59b2d1',
        'nyu-magenta': '#fb0f78',
        'nyu-yellow':  '#f4ec51',

        // Dark mode surfaces (violet-tinted, not generic gray)
        surface: {
          base:    '#f2f2f2',
          raised:  '#ffffff',
          overlay: '#ffffff',
          'dark-base':    '#0F0A14',
          'dark-raised':  '#1A1224',
          'dark-overlay': '#221830',
          'dark-subtle':  '#2C2040',
          'dark-muted':   '#3D2F55',
        },

        // Text hierarchy tokens
        ink: {
          primary:   '#404040',
          secondary: '#6d6d6d',
          tertiary:  '#b8b8b8',
          inverse:   '#ffffff',
          'dark-primary':   '#eee6f3',
          'dark-secondary': '#ab82c5',
          'dark-tertiary':  '#7b5aa6',
        },
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgb(87 6 140 / 0.06), 0 1px 2px -1px rgb(87 6 140 / 0.04)',
        'card-hover': '0 8px 24px -4px rgb(87 6 140 / 0.14), 0 2px 8px -2px rgb(87 6 140 / 0.08)',
        modal:      '0 24px 64px -12px rgb(87 6 140 / 0.22), 0 0 0 1px rgb(87 6 140 / 0.06)',
        navbar:     '0 1px 0 0 rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
}
