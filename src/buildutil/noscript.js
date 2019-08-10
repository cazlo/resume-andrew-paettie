const cheerio = require('cheerio');
const fs = require('fs');

const noScriptContents = fs.readFileSync('build/noscript/index.html', 'utf8');
const noScriptDocument = cheerio.load(noScriptContents);
console.log('Parsed rendered DOM');
const appNode = noScriptDocument('#root').html();
// console.log(appNode);
const style = noScriptDocument('style[data-jss]')
  .map(function(i, el) {
    return cheerio(el).html();
  })
  .get()
  .join('\n');

// console.log(style);
const normalContents = fs.readFileSync('build/index.html', 'utf8');
const normalIndex = cheerio.load(normalContents);
normalIndex('#root').replaceWith(
  `<div id="root"><noscript>${appNode}<style>${style}</style></noscript></div>`,
);
console.log('Writing to file');
// console.log(normalIndex.html());
fs.writeFileSync('build/index.html', normalIndex.html());
console.log('noscript replace success!!!!');
