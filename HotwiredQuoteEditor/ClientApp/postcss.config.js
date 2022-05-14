const isProductionMode = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(isProductionMode ? { cssnano: {} } : {})
  }
}