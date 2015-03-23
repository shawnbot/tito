var extend = require('extend'),
    multiline = require('multiline'),
    csv = require('fast-csv'),
    ndjson = require('ndjson'),
    jsonStream = require('JSONStream'),
    table = require('html-table-stream');
    // datex = require('data-expression');

var formats = {
  names: [],
  showHelp: function(format, log, $0) {
    if (!log) log = console.log.bind(console);

    log('Formats:');
    log(multiline(function(){/*

The following values may be used for the input and output format
options, --read/-r or --write/-w:

  $0 --read csv --write tsv
  $0 -r csv -w tsv

If you wish to specify format options, you must use the dot notation:

  $0 --read.format csv --read.delim=, data.csv
  $0 -r.format json -r.path='results.*' data.json
  $0 data.ndjson | tito -w.format html -w.indent='  '
    */}).replace(/\$0/g, $0));

    if (format === true) {
      log(multiline(function(){/*

Use "--help formats" to see more about formats.

      */}));
    } else {
      formats.names.forEach(function(name, i) {
        if (format !== 'formats' && format !== name) return;
        log('');
        formats[name].showHelp(log);
      });
    }
  }
};

// CSV
formats.csv = createFormat('csv', {
  description: 'Read and write comma-separated (or otherwise-delimted) text',
  headers: {
    description: 'Whether to parse headers in the first row of input',
    default: true,
    hide: true
  },
  delimiter: {
    description: 'The field delimiter',
    alias: ['delim', 'd'],
    default: ','
  },
  newline: {
    description: 'The row delimiter',
    alias: ['line', 'n'],
    default: '\n'
  },
  quote: {
    description: 'The quote character',
    alias: ['q'],
    default: '"'
  }
}, csv.parse, csv.format);

// TSV
formats.tsv = createFormat('tsv', {
  description: 'Read and write tab-separated values',
  headers: {
    description: '',
    default: true
  },
  delimiter: {
    description: '',
    alias: ['delim', 'd'],
    default: '\t',
    hide: true
  },
  newline: {
    description: 'The line separator character sequence',
    alias: ['line', 'n'],
    default: '\n'
  }
  // TODO: escape character?
}, csv.parse, csv.format);

// Newline-Delimited JSON
formats.ndjson = createFormat('ndjson', {
  description: 'Read and write newline-delimted JSON',
  // no options
}, ndjson.parse, ndjson.stringify);

// Newline-Delimited JSON
formats.json = createFormat('json', {
  description: 'Read and write arrays from streaming JSON',
  path: {
    description: 'The JSONPath selector containing the data',
    alias: ['p'],
    readonly: true,
    default: '.*'
  },
  /*
  map: {
    alias: ['m'],
    default: null
  },
  */
  open: {
    description: 'Output this string before streaming items',
    alias: ['o'],
    writeonly: true,
    default: '[\n  '
  },
  separator: {
    description: 'Output this string between items',
    alias: ['sep', 's'],
    writeonly: true,
    default: ',\n  '
  },
  close: {
    description: 'Output this string after writing all items',
    alias: ['c'],
    writeonly: true,
    default: '\n]\n'
  }
}, function jsonReader(options) {
  return jsonStream.parse(options.path);
}, function jsonWriter(options) {
  return jsonStream.stringify(
    options.open,
    options.separator,
    options.close
  );
});

formats.html = createFormat('html', {
  description: 'Read and write data from HTML tables',
  selector: {
    description: 'the CSS selector of the table to target',
    alias: ['s'],
    readonly: true,
    default: 'table'
  },
  indent: {
    description: 'indent HTML with this string',
    alias: ['i'],
    writeonly: true,
    default: '',
  }
}, function htmlReader(options) {
  return table.parse(options);
}, function htmlWriter(options) {
  if (options.format === 'html') {
    delete options.format;
  }
  return table.format(options);
});

module.exports = formats;
module.exports.createReadStream = createReadStream;
module.exports.createWriteStream = createWriteStream;
module.exports.resolve = resolveFormat;

function resolveFormat(name, options) {
  if (typeof name === 'object') {
    options = name;
    name = name.format || name.name;
  }
  if (!formats.hasOwnProperty(name)) {
    throw new Error('No such format: "' + name + '"');
  }
  return {
    format: formats[name],
    options: options || {}
  };
}

function createReadStream(name, options) {
  var resolved = resolveFormat(name, options);
  return resolved.format.createReadStream(resolved.options);
}

function createWriteStream(name, options) {
  var resolved = resolveFormat(name, options);
  return resolved.format.createWriteStream(resolved.options);
}

function createFormat(name, opts, reader, writer) {
  formats.names.push(name);

  var defaults = {};
  for (var key in opts) {
    if (opts[key].default) {
      defaults[key] = opts[key].default;
    }
  }

  function parseOptions(options) {
    for (var dest in opts) {
      var opt = opts[dest];
      if (!options[dest] && opt.alias) {
        opt.alias.forEach(function(key) {
          if (options[key]) {
            options[dest] = options[key];
            delete options[key];
          }
        });
      }
    }
    return extend({}, defaults, options);
  }

  return {
    name: name,
    options: opts,
    defaults: defaults,
    parseOptions: parseOptions,
    showHelp: function(log) {
      if (!log) log = console.log.bind(console);
      log('"%s": %s', name, opts.description || '');
      if (Object.keys(opts).length) {
        log('  Options:');
        for (var key in opts) {
          var opt = opts[key];
          if (key === 'description' || opt.hide) continue;
          var alias = (opt.alias || []).map(function(k) {
            return ', "' + k + '"';
          }).join('');
          var flag = opt.readonly
            ? ' (read-only)'
            : opt.writeonly
              ? ' (write-only)'
              : '';
          log('  - "%s"%s: %s%s', key, alias, opts[key].description || '', flag);
        }
      }
    },
    createReadStream: function(options) {
      options = parseOptions(options);
      // console.warn('creating %s reader with options:', name, options);
      return reader(options);
    },
    createWriteStream: function(options) {
      options = parseOptions(options);
      // console.warn('creating %s writer with options:', name, options);
      return writer(options);
    }
  };
}
