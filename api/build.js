var files = [
  'legal/about.md',
  'legal/data_security.md',
  'legal/legal.md',
  'legal/small.md',
  'legal/terms_of_use.md'
]
var showdown = require('showdown'),
  fs = require('fs')

files.forEach(filename => {
  console.log(`Converting '${filename}' ...`)
  fs.readFile(filename, 'utf8', (err, data) => {
    if(err)
      throw "Couldn't read file!\n"+err
    var converter = new showdown.Converter()
    html = converter.makeHtml(data)
    fs.writeFile(filename.replace(/\.md$/gi, '.html'), html, 'utf8', err => {
      if(err)
        throw "Couldn't write file!\n"+err
    })
  })
});

