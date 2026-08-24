console.log(require('esbuild').transformSync(`
.glass {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.glass2 {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
`, { loader: 'css', minify: true }).code)
