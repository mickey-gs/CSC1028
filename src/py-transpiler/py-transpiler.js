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

    // let imports = this.corrections.imports;
    // for (let imp of imports) {
    //   if (!this.buffer.get().find(`import ${imp}`)) {
    //     this.buffer.prepend(`import ${imp}\n\n`)
    //   }
    // }
    let regex = /(\w+)\.length/gi;
    code = code.replace(regex, 'len($1)');
    regex = /math.cbrt\(([^\)]+)\)/gm;
    code = code.replace(regex, "(($1) ** (1. / 3))")

    regex = /(\w+)\+\+/gmi
    code = code.replace(regex, '$1 += 1')

    return code
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

  ConditionalExpression(node) {
    this.buffer.add("(");
    this.parse(node.consequent);
    this.buffer.add(" if ");
    this.parse(node.test);
    this.buffer.add(" else ");
    this.parse(node.alternate);
    this.buffer.add(")");
  }
  
  ForStatement(node) {
    this.parse(node.init)
    node.type = 'WhileStatement'
    node.body.body.push(node.update)
    this[node.type](node)
  }

  UpdateExpression(node) {
    if (node.prefix) {
      this.buffer.add(node.operator)
    }
    this.parse(node.argument)
    if (!node.prefix) {
      this.buffer.add(node.operator)
    }
  }
}