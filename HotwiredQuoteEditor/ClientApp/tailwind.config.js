module.exports = {
  content: ['../Pages/**/*.cshtml', '../Areas/**/*.cshtml'],
  theme: {
    extend: {
      colors: {
        site: {
          "50": "#FBEAED",
          "100": "#F7D4DA",
          "200": "#EEAAB5",
          "300": "#E67F90",
          "400": "#DD556B",
          DEFAULT: "#D52A47",
          "600": "#AA2238",
          "700": "#80192A",
          "800": "#55111C",
          "900": "#2B080E"
        }
      },
    },
    plugins: [
      require('@tailwindcss/forms')
    ]
  }
}