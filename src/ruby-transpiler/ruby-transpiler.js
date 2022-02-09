import { TranspilerSuper } from "../transpiler-super/transpiler-super.js";
import * as fs from "fs";

export class RubyTranspiler extends TranspilerSuper {
  corrections;

  constructor() {
    super();
    this.corrections = JSON.parse(fs.readFileSync("./src/ruby-transpiler/ruby.json"));
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
    return code;
  }

  FunctionDeclaration(node) {
    this.buffer.add("def ");
    super.FunctionDeclaration(node);
  }

  BlockStatement(node) {
    this.buffer.indent();
    this.buffer.newline();
    super.BlockStatement(node);
    this.buffer.trim();
    this.buffer.dedent();
    this.buffer.newline();
    this.buffer.add("end");
    this.buffer.newline();
  }

  VariableDeclaration(node) {
    super.VariableDeclaration(node);
    this.buffer.newline();
  }

  ReturnStatement(node) {
    this.buffer.add("return ");
    super.ReturnStatement(node);
    this.buffer.newline();
  }
}