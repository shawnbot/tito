#!/usr/bin/env node
var $0 = 'tito';
var tito = require('./');
var formats = tito.formats;

var yargs = require('yargs')
  .usage($0 + ' [options] [input] [output]')
  .describe('read', 'the input format (see below)')
  .default('read', 'ndjson')
  .alias('r', 'read')
  .describe('write', 'the output format (see below)')
  .default('write', 'ndjson')
  .alias('w', 'write')
  .describe('in', 'the input filename')
  .alias('i', 'in')
  .describe('out', 'the output filename')
  .alias('o', 'out')
  .describe('filter', 'filter input by this data expression')
  .alias('f', 'filter')
  .describe('map', 'map input to this data expression')
  .alias('m', 'map')
  .describe('multiple', 'Allow one-to-many array transforms')
  .boolean('multiple')
  .describe('help', 'Show this help message.')
  .describe('version', 'Print the version and exit')
  .alias('v', 'version')
  .alias('h', 'help')
  .wrap(72);

var options = yargs.argv;
var args = options._;

if (options.version) {
  console.log($0, 'v' + tito.version);
  return process.exit(0);
}

if (options.help) {
  yargs.showHelp();
  formats.showHelp(options.help, null, $0);
  return process.exit(1);
}

var fs = require('fs');

// hush EPIPE errors
require('epipebomb')();

delete options._;
delete options.$0;

var input = options.in || args[0] || '/dev/stdin';
var output = options.out || args[1] || '/dev/stdout';
var parse = formats.createReadStream(options.read);
var format = formats.createWriteStream(options.write);

var stream = fs.createReadStream(input)
  .pipe(parse);

if (options.map || options.filter) {
  var fof = require('fof');
  var expr = require('./lib/require-expression');

  var map = options.map ? expr(options.map) : null;
  var filter = options.filter ? expr(options.filter) : null;
  var transform = fof.stream(map, {
    filter: filter,
    multiple: options.multiple
  });

  stream = stream.pipe(transform);
}

stream = stream
  .pipe(format)
  .pipe(fs.createWriteStream(output));
