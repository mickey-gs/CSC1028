import { Parser } from "./parser.js"

export class PyParser extends Parser {
  constructor() {
    super();
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
    this.buffer.add("): ");
    this.parse(node.body);
  }

  ReturnStatement(node) {
    this.buffer.add("return ");
    super.ReturnStatement(node);
    this.buffer.newline();
  }

  BlockStatement(node) { 
    this.buffer.indent();
    this.buffer.newline();
    super.BlockStatement(node);
    this.buffer.trim();
    this.buffer.dedent();
    this.buffer.newline().newline();
  }
}