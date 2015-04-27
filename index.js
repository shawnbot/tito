var formats = require('./lib/formats');
module.exports = {
  version: require('./package.json').version,
  formats: formats,
  createReadStream: formats.createReadStream,
  createWriteStream: formats.createWriteStream
};
