# tito
tito is a command-line utility for translating between tabular text data
formats such as CSV, TSV, JSON and HTML tables.
It stands for **T**ables **I**n, **T**ables **O**ut.

## Installation
Install it with [npm](https://www.npmjs.com/package/tito):

```
npm install -g tito
```

## Usage
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

"html": Read and write data from HTML tables
  Options:
  - "indent", "i": indent HTML with this string  (write-only)
  - "selector", "s": the CSS selector of the table to target  (read-only)
```
