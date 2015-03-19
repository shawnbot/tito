# tito
tito is a command-line utility for translating between tabular text data
formats such as CSV, TSV, and JSON. It stands for **T**ables **I**n,
**T**ables **O**ut.

## Installation
Install it with:

```
npm install -g tito
```

## Usage
```
tito [options] [input] [output]

Options:
  --read, -r     the input format (see below)        [default: "ndjson"]
  --write, -w    the output format (see below)       [default: "ndjson"]
  --in, -i       the input filename              [default: "/dev/stdin"]
  --out, -o      the output filename            [default: "/dev/stdout"]
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

  tito --read.format csv --read.delim=,
  tito -r.format json -r.path='results.*'

"csv": Read and write comma-separated (or otherwise-delimted) text
  Options:
  - "delimiter", "delim", "d": The field delimiter
  - "newline", "line", "n": The row delimiter
  - "quote", "q": The quote character

"tsv": Read and write tab-separated values
  Options:
  - "headers": 
  - "delimiter", "delim", "d": 
  - "newline", "line", "n": 

"ndjson": Read and write newline-delimted JSON
  Options:

"json": Read and write arrays from streaming JSON
  Options:
  - "path", "p": 
  - "open", "o": 
  - "separator", "sep", "s": 
  - "close", "c": 
```
