/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zeterminal: {
          dark: '#0d1117',
          darker: '#010409',
          panel: '#161b22',
          border: '#30363d',
          text: '#c9d1d9',
          textMuted: '#8b949e',
          accent: '#1f6feb',
          green: '#3fb950',
          red: '#f85149',
          yellow: '#d29922',
        },
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}

