import { PyTranspiler } from "./src/py-transpiler/py-transpiler.js";
import { RubyTranspiler } from "./src/ruby-transpiler/ruby-transpiler.js";
import * as babel from "@babel/parser"

export function toRuby(code) {
  let ast = babel.parse(code, {ecmaVersion: 'latest', sourceType: 'module'})
  const transpiler = new RubyTranspiler

  return transpiler.parse(ast)
}

export function toPython(code) {
  let ast = babel.parse(code, {ecmaVersion: 'latest', sourceType: 'module'})
  const transpiler = new PyTranspiler

  return transpiler.parse(ast)
}