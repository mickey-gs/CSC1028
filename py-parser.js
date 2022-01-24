import { Parser } from "./parser.js"
import * as fs from "fs"

export class PyParser extends Parser {
  corrections;
  
  constructor() {
    super();
    this.corrections = JSON.parse(fs.readFileSync("./python.json"));
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
    this.parse(node.id);
    this.buffer.add("(");
    for (let i = 0; i < node.params.length; i++) {
      this.parse(node.params[i]);
    }
    this.buffer.add(")");
    this.parse(node.body);
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