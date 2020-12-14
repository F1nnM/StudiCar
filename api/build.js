// convert all big texts from MD to HTML

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
    if (err)
      throw "Couldn't read file!\n" + err
    var converter = new showdown.Converter()
    html = converter.makeHtml(data)
    fs.writeFile(filename.replace(/\.md$/gi, '.html'), html, 'utf8', err => {
      if (err)
        throw "Couldn't write file!\n" + err
    })
  })
});


// copy all postillon tickers from TXT file to array in JS to get better access

const newsPath = 'news/postillon/ticker.txt'

fs.readFile(newsPath, 'utf8', (err, data) => {
  if (err) throw err;
  var news = data.toString().split("\n");
  news = news.filter(line => !line.includes('//') && line.length) // ignore all lines containing '//' and all empty lines

  news = news.map(t => t.split('+++')[1].trim())
  console.log('Copying ' + newsPath + ' to JS....')
  var js = JSON.stringify(news)
  fs.writeFile(newsPath.replace(/\.txt$/gi, '.js'), 'module.exports = ' + js, 'utf8', err => {
    if (err)
      throw "Couldn't write file!\n" + err
  })
  console.log('...done')
})