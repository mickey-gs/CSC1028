import { TranspilerSuper } from "../transpiler-super/transpiler-super.js"
import * as fs from "fs"

export class PyTranspiler extends TranspilerSuper {
  corrections;
  
  constructor() {
    super();
    this.corrections = JSON.parse(fs.readFileSync("./src/py-transpiler/python.json"));
  }

  parse(node) {
    this[node.type](node);
    let code = this.buffer.get();
    return this.correct(code);
  }

  correct(code) {
    for (let key of Object.keys(this.corrections)) {
      this.buffer.replace(key, this.corrections[key]);
    }
    let regex = / (\w+)\.length/gi;
    return code.replace(regex, 'len($1)');
  }

  ExpressionStatement(node) {
    super.ExpressionStatement(node);
    this.buffer.newline();
  }

  VariableDeclaration(node) {
    super.VariableDeclaration(node);
    this.buffer.newline();
  }

  FunctionDeclaration(node) {
    this.buffer.add("def ");
    super.FunctionDeclaration(node);
  }

  ReturnStatement(node) {
    this.buffer.add("return ");
    super.ReturnStatement(node);
    this.buffer.newline();
  }

  BlockStatement(node) {
    this.buffer.trim();
    this.buffer.add(":")
    this.buffer.indent();
    this.buffer.newline();
    super.BlockStatement(node);
    this.buffer.trim();
    this.buffer.dedent();
    this.buffer.newline();
  }
}