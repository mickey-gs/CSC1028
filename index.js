import { JSTranspiler } from "./src/js-transpiler/js-transpiler.js";
import { PyTranspiler } from "./src/py-transpiler/py-transpiler.js";
import { RubyTranspiler } from "./src/ruby-transpiler/ruby-transpiler.js";
import * as acorn from "acorn";

exports.toRuby = function(code) {
  let ast = acorn.parse(code)
  const transpiler = new RubyTranspiler

  return transpiler.parse(ast)
}

exports.toPython = function(code) {
  let ast = acorn.parse(code)
  const transpiler = new PyTranspiler

  return transpiler.parse(ast)
}