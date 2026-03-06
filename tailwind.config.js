/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'xuanwu-red': '#8A1A11',
        'xuanwu-red-light': '#B33428',
        'xuanwu-gold': '#C49A52',
        'xuanwu-gold-light': '#D6B475',
        'xuanwu-ink': '#2c3e50',
        'xuanwu-text': '#4a3e35',
        'xuanwu-text-light': '#7a6a57',
        'xuanwu-paper': '#f2ecd7',
        'xuanwu-paper-light': '#fAf7ec',
        'xuanwu-paper-dark': '#e2d3b6',
        'xuanwu-border': '#d2b994',
        'xuanwu-border-dark': '#A07E5B',
        'xuanwu-bg': '#E8DCC2',
      },
      fontFamily: {
        'sans': ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'serif': ['"Noto Serif SC"', 'SimSun', 'STSong', '"KaiTi"', 'serif'], // Traditional Chinese fonts
      },
      boxShadow: {
        'antique': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(138, 26, 17, 0.05)',
        'antique-inner': 'inset 0 0 10px rgba(160, 126, 91, 0.2)',
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100\" height=\"100\" filter=\"url(%23noise)\" opacity=\"0.05\"/%3E%3C/svg%3E')",
      }
    },
  },
  plugins: [],
}
