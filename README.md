# risk-code-tool

Tool to check sentiment in source code, to look for negative/risky development practices. Using:

* NodeJS 8.x
* Sentiment


## Installation

Install the cli:

    npm install -g


## Usage

Running the tool:

    risk --path=examples/**/*.* --log=-3


## Example output

    examples/javascript.js:1 This is annoying
    examples/javascript.js:3 function badComments
    examples/javascript.js:4 console log This is the worst


## Contact

For more information please contact kmturley
