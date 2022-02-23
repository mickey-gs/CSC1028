import { JSTranspiler } from "./src/js-transpiler/js-transpiler.js";
import { PyTranspiler } from "./src/py-transpiler/py-transpiler.js";
import { RubyTranspiler } from "./src/ruby-transpiler/ruby-transpiler.js";
import * as acorn from "acorn";
import * as fs from "fs";

if (!fs.existsSync("./outputs")) {
  fs.mkdirSync("./outputs")
} 

const contents = fs.readFileSync(process.argv[process.argv.length - 1]);
var ast = acorn.parse(contents, {ecmaVersion: 2020});
console.log("ORIGINAL:");
console.log(contents + "\n");

let parsed;
let copyAst = {"type": 'idk'};


Object.assign(copyAst, ast)
let jsTranspiler = new JSTranspiler;
console.log("JAVASCRIPT OUTPUT:");
parsed = jsTranspiler.parse(copyAst);
console.log(parsed);
fs.writeFileSync("./outputs/js.js", parsed);

Object.assign(copyAst, ast)
ast = acorn.parse(contents, {ecmaVersion: 2020});
let pyTranspiler = new PyTranspiler;
console.log("PYTHON OUTPUT:");
parsed = pyTranspiler.parse(copyAst);
console.log(parsed);
fs.writeFileSync("./outputs/py.py", parsed);

Object.assign(copyAst, ast)
ast = acorn.parse(contents, {ecmaVersion: 2020});
let rubyTranspiler = new RubyTranspiler;
console.log("RUBY OUTPUT: ");
parsed = rubyTranspiler.parse(copyAst);
console.log(parsed);
fs.writeFileSync("./outputs/rb.rb", parsed);
