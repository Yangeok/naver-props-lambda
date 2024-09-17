/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 프로젝트 구조에 따라 경로를 조정하세요.
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
  variants: {
    extend: {
      width: ['responsive'],
    },
  },
}
