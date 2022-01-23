import { JSParser } from "./js-parser.js";
import { PyParser } from "./py-parser.js"
import * as acorn from "acorn";
import * as fs from "fs";

var contents = fs.readFileSync(process.argv[process.argv.length - 1]).toString();
var ast = acorn.parse(contents, {ecmaVersion: 2020});
console.log("ORIGINAL:");
console.log(contents + "\n");

let jsParser = new JSParser;
console.log("JAVASCRIPT OUTPUT:");
console.log(jsParser.parse(ast));

let pyParser = new PyParser;
console.log("PYTHON OUTPUT:");
process.stdout.write(pyParser.parse(ast));