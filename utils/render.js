const fs = require('mz/fs');
const path = require('path');
const nunjucks = require('nunjucks');
const makrdownTag = require('nunjucks-markdown');
const markdownIt = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

const env = new nunjucks.Environment(
	new nunjucks.FileSystemLoader(
		[
      path.resolve(process.cwd(), 'views'),
      path.resolve(process.cwd(), 'bower_components/ftc-footer')
    ],
		{
			watch: false,
			noCache: true
		}
	),
	{
		autoescape: false
	}
);

function isotime(date) {
  if (!date) {
    return '';
  } else if (!(date instanceof Date)) {
    return date;
  }

  return date.toISOString();
}
function md(str, inline) {
  return !str ? '' :
    (inline ? markdownIt.renderInline(str) : markdownIt.render(str));
}
env.addFilter('isotime', isotime);
env.addFilter('md', md);
/*
 * @param {Bloolean} unixtime
 * @return 1482540353859 if true
 * @return Sat Dec 24 2016 08:40:09 GMT+0800 (CST) if false
 */
function now(unixtime) {
  return unixtime ? Date.now() : new Date();
}
env.addGlobal('now', now);

// See https://github.com/markdown-it/markdown-it/issues/247
makrdownTag.register(env, md);

function render(template, context, name) {
  return new Promise(function(resolve, reject) {
    env.render(template, context, function(err, result) {
      if (err) {
        reject(err);
      } else {
        if (typeof context === 'string') {
          resolve({
            name: context,
            content: result
          });          
        } else if (name && (typeof name === 'string')) {
          resolve({
            name: name,
            content: result
          }); 
        } else {
          resolve(result);
        }
      }
    });
  });
}

module.exports = render;