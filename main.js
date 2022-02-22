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

let jsTranspiler = new JSTranspiler;
console.log("JAVASCRIPT OUTPUT:");
parsed = jsTranspiler.parse(ast);
console.log(parsed);
fs.writeFileSync("./outputs/js.js", parsed);

let pyTranspiler = new PyTranspiler;
console.log("PYTHON OUTPUT:");
parsed = pyTranspiler.parse(ast);
console.log(parsed);
fs.writeFileSync("./outputs/py.py", parsed);

let rubyTranspiler = new RubyTranspiler;
console.log("RUBY OUTPUT: ");
parsed = rubyTranspiler.parse(ast);
console.log(parsed);
fs.writeFileSync("./outputs/rb.rb", parsed);
