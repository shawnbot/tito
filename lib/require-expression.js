var relative = require('require-relative');
var fs = require('fs');

module.exports = function resolveExpression(expressionOrFilename) {
  var filename = expressionOrFilename;
  if (filename.match(/\.js(on)?$/)) {
    return relative(filename, process.cwd());
  }
  return expressionOrFilename;
};
