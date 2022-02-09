import { TranspilerSuper } from "../transpiler-super/transpiler-super.js"

export class JSTranspiler extends TranspilerSuper {
  constructor() {
    super();
  }

  ExpressionStatement(node) {
    super.ExpressionStatement(node);
    this.buffer.add(";");
    this.buffer.newline();
  }

  FunctionDeclaration(node) {
    this.buffer.add("function ");
    super.FunctionDeclaration(node);
  }

  ReturnStatement(node) {
    this.buffer.add("return ");
    super.ReturnStatement(node);
    this.buffer.add(";")
    this.buffer.newline();
  }

  BlockStatement(node) { 
    this.buffer.add(" {");
    this.buffer.indent();
    this.buffer.newline();
    super.BlockStatement(node);
    this.buffer.trim();
    this.buffer.dedent();
    this.buffer.newline();
    this.buffer.add("}");
    this.buffer.newline();
  }

  VariableDeclaration(node) {
    this.buffer.add(node.kind + " ");
    super.VariableDeclaration(node);
    this.buffer.add(";").newline();
  }

  IfStatement(node) {
    this.buffer.add("if (");
    this.parse(node.test);
    this.buffer.add(")");
    this.parse(node.consequent);
    if (node.alternate) {
      this.buffer.add("else ");
      this.parse(node.alternate);
    }
  }
}