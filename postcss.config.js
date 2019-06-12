module.exports = {
  plugins: [
    require('autoprefixer')({
      grid: true,
      flexbox: true,
      cascade: true,
    }),
    require('cssnano'),
   ]
}