import { JSTranspiler } from "./src/js-transpiler/js-transpiler.js";
import { PyTranspiler } from "./src/py-transpiler/py-transpiler.js";
import { RubyTranspiler } from "./src/ruby-transpiler/ruby-transpiler.js";
import * as acorn from "acorn";

export function toRuby(code) {
  let ast = acorn.parse(code, {ecmaVersion: 'latest', sourceType: 'module'})
  const transpiler = new RubyTranspiler

  return transpiler.parse(ast)
}

export function toPython(code) {
  let ast = acorn.parse(code, {ecmaVersion: 'latest', sourceType: 'module'})
  const transpiler = new PyTranspiler

  return transpiler.parse(ast)
}