const parser = require("./parser.js");
const acorn = require("acorn");
const fs = require("fs");

var contents = fs.readFileSync(process.argv[process.argv.length - 1]).toString();
var ast = acorn.parse(contents, {ecmaVersion: 2020});
parser.parse(ast);