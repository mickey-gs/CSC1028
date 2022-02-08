import { JSParser } from "./src/js-transpiler/js-transpiler.js";
import { PyParser } from "./src/py-transpiler/py-transpiler.js";
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