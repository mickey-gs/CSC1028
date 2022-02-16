import { JSTranspiler } from "./src/js-transpiler/js-transpiler.js";
import { PyTranspiler } from "./src/py-transpiler/py-transpiler.js";
import { RubyTranspiler } from "./src/ruby-transpiler/ruby-transpiler.js";
import * as acorn from "acorn";
import * as fs from "fs";

if (!fs.existsSync("./outputs")) {
  fs.mkdirSync("./outputs")
} 

var ast = acorn.parse(contents, {ecmaVersion: 2020});
console.log("ORIGINAL:");
console.log(contents + "\n");

let jsTranspiler = new JSTranspiler;
console.log("JAVASCRIPT OUTPUT:");
console.log(jsTranspiler.parse(ast));
jsTranspiler.clear();
fs.writeFileSync("./outputs/js.js", jsTranspiler.parse(ast));

let pyTranspiler = new PyTranspiler;
console.log("PYTHON OUTPUT:");
console.log(pyTranspiler.parse(ast));
pyTranspiler.clear();
fs.writeFileSync("./outputs/py.py", pyTranspiler.parse(ast));

let rubyTranspiler = new RubyTranspiler;
console.log("RUBY OUTPUT: ");
console.log(rubyTranspiler.parse(ast));
rubyTranspiler.clear();
fs.writeFileSync("./outputs/rb.rb", rubyTranspiler.parse(ast));