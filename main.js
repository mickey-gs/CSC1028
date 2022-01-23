import { JSParser } from "./js-parser.js";
import { PyParser } from "./py-parser.js"
import * as acorn from "acorn";
import * as fs from "fs";

var contents = fs.readFileSync(process.argv[process.argv.length - 1]).toString();
var ast = acorn.parse(contents, {ecmaVersion: 2020});
let parser = new PyParser;
process.stdout.write(parser.parse(ast));