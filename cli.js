#!/usr/bin/env node
var multiline = require('multiline'),
    fs = require('fs'),
    tito = require('./'),
    formats = tito.formats,
    $0 = 'tito',
    yargs = require('yargs')
      .usage($0 + ' [options] [input] [output]')
      .describe('read', 'the input format (see below)')
        .default('read', 'ndjson')
        .alias('read', 'r')
      .describe('write', 'the output format (see below)')
        .default('write', 'ndjson')
        .alias('write', 'w')
      .describe('in', 'the input filename')
        .alias('in', 'i')
      .describe('out', 'the output filename')
        .alias('out', 'o')
      .describe('filter', 'filter input by this data expression')
        .alias('filter', 'f')
      .describe('map', 'map input to this data expression')
        .alias('map', 'm')
      .describe('help', 'Show this help message.')
      .describe('version', 'Print the version and exit')
        .alias('version', 'v')
      .alias('help', 'h')
      .wrap(72),
    options = yargs.argv,
    args = options._;

if (options.version) {
  console.log($0, 'v' + tito.version);
  return process.exit(0);
}

if (options.help) {
  yargs.showHelp();
  formats.showHelp(options.help, null, $0);
  return process.exit(1);
}

delete options._;
delete options.$0;

var input = options.in || args[0] || '/dev/stdin',
    output = options.out || args[1] || '/dev/stdout',
    read = formats.createReadStream(options.read),
    write = formats.createWriteStream(options.write);

fs.createReadStream(input)
  .pipe(read)
  .pipe(write)
  .pipe(fs.createWriteStream(output));
