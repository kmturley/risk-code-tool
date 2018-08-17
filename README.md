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

    examples/css/stylesheet.css:1 example stylesheet
    examples/css/stylesheet.css:3 bad
    examples/css/stylesheet.css:4 background red
    examples/javascript.js:1 This is annoying
    examples/javascript.js:3 function badComments
    examples/javascript.js:4 console log This is the worst
    examples/css/stylesheet.css:7 I hate this code


## Contact

For more information please contact kmturley
