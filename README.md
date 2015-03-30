# tito
tito is a command-line utility for translating between tabular text
data formats such as CSV, TSV, JSON and HTML tables.
It stands for **T**ables **I**n, **T**ables **O**ut.

## Formats
* JSON: structured with [JSONPath] queries and
  [newline-delimited](http://ndjson.org), which is the default for
  input and output.
* Comma-, tab-, and otherwise-delimited text, with support for custom
  column and row delimiters.
* HTML tables, with support for targeted parsing with CSS selectors
  and formatted output.

## Installation
Install it with [npm](https://www.npmjs.com/package/tito):

```
npm install -g tito
```

## Examples
Here are some examples of what tito can do:

##### Convert CSV to TSV
Use the `--read` and `--write` options to set the read and write
formats:

```sh
tito --read csv data.csv --write tsv data.tsv
```

Or pipe data into and out of tito via stdio:

```sh
cat data.csv | tito --read csv --write tsv > data.tsv
```

##### Turn HTML tables into CSV
tito's `html` reader uses a [streaming HTML parser] and can target
tables with CSS selectors:

```sh
curl -s "http://www.federalreserve.gov/releases/h15/current/" \
  | tito --read.format html --read.selector 'table.statistics' --write csv \
  > interest-rates.csv
```

##### Import structured JSON data from a URL into dat
tito can take structured JSON like this:

```js
{
  "results": [
    { /* ... */ },
    // etc.
  ]
}
```

and turn it into [newline-delimited JSON]. Just set `--read.format`
to `json` and `--read.path` to the [JSONPath] expression of your data
elements. For the structure above, which is common to many REST APIs,
you would use `results.*`. You could then use the following to import
data from one such API into [dat]:

```sh
curl -s http://api.data.gov/some-data \
  | tito --read.format json --read.path 'results.*' \
  | dat import
```

##### Modify, filter and map with `data-expression`
The [data-expression] module's `datex` CLI tool takes newline-delimited JSON,
which means that you can do things like this:

```sh
tito --read csv data.csv \
  | datex --filter 'type === "foo"' \
  | tito --write csv > foo.csv
```

## Usage
This is the output of `tito --help formats`:
```
tito [options] [input] [output]

Options:
  --read, -r     the input format (see below)        [default: "ndjson"]
  --write, -w    the output format (see below)       [default: "ndjson"]
  --in, -i       the input filename                                     
  --out, -o      the output filename                                    
  --filter, -f   filter input by this data expression           [string]
  --map, -m      map input to this data expression              [string]
  --help, -h     Show this help message.                                
  --version, -v  Print the version and exit                             

Formats:

The following values may be used for the input and output format
options, --read/-r or --write/-w:

  tito --read csv --write tsv
  tito -r csv -w tsv

If you wish to specify format options, you must use the dot notation:

  tito --read.format csv --read.delim=, data.csv
  tito -r.format json -r.path='results.*' data.json
  tito data.ndjson | tito -w.format html -w.indent='  '

"csv": Read and write comma-separated (or otherwise-delimted) text
  Options:
  - "delimiter", "delim", "d": The field delimiter
  - "newline", "line", "n": The row delimiter
  - "quote", "q": The quote character

"tsv": Read and write tab-separated values
  Options:
  - "headers": 
  - "newline", "line", "n": The line separator character sequence

"ndjson": Read and write newline-delimted JSON
  Options:

"json": Read and write arrays from streaming JSON
  Options:
  - "path", "p": The JSONPath selector containing the data (read-only)
  - "open", "o": Output this string before streaming items (write-only)
  - "separator", "sep", "s": Output this string between items (write-only)
  - "close", "c": Output this string after writing all items (write-only)

"html": Read and write data from HTML tables
  Options:
  - "selector", "s": the CSS selector of the table to target (read-only)
  - "indent", "i": indent HTML with this string (write-only)
```

[dat]: http://dat-data.com/
[newline-delimited JSON]: http://ndjson.org/
[JSONPath]: http://jsonpath.curiousconcept.com/
[streaming HTML parser]: https://www.npmjs.com/package/htmlparser2
[data-expression]: https://github.com/shawnbot/data-expression
