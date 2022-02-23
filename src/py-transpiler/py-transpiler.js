import { TranspilerSuper } from "../transpiler-super/transpiler-super.js"
import * as fs from "fs"

export class PyTranspiler extends TranspilerSuper {
  corrections;
  
  constructor() {
    super();
    this.corrections = JSON.parse(fs.readFileSync("./src/py-transpiler/python.json"));
  }

  parse(node) {
    return this.recursiveParse(node)
  }

  recursiveParse(node) {
    if (node.type == 'ForStatement') console.log(node.type)
    this[node.type](node);
    let code = this.buffer.get();
    return this.correct(code);
  }

  correct(code) {
    for (let key of Object.keys(this.corrections)) {
      this.buffer.replace(key, this.corrections[key]);
    }

    for (const module of this.corrections.imports) {
      if (code.search(module + '.') !== -1) {
        code = 'import ' + module + '\n\n' + code
      }
    }

    let regex = /(\w+)\.length/gi;
    code = code.replace(regex, 'len($1)');
    regex = /math.cbrt\(([^\)]+)\)/gm;
    code = code.replace(regex, "(($1) ** (1. / 3))")

    regex = /(\w+)\+\+/gmi
    code = code.replace(regex, '$1 += 1')

    code = code.replace(/print\((.+)\)\n/gmi, (input, $1) => {
      let args = $1.split(' + ')

      for (let i = 0; i < args.length; i++) {
        if (args[i][0] != '\'' && args[i][0] != '"') {
          args[i] = 'str(' + args[i] + ')'
        }
      }

      return 'print(' + args.join(' + ') + ')\n'
    })

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
    this.recursiveParse(node.consequent);
    this.buffer.add(" if ");
    this.recursiveParse(node.test);
    this.buffer.add(" else ");
    this.recursiveParse(node.alternate);
    this.buffer.add(")");
  }
  
  ForStatement(node) {
    this.recursiveParse(node.init)
    node.type = 'WhileStatement'
    node.body.body.push(node.update)
    this[node.type](node)
  }

  UpdateExpression(node) {
    if (node.prefix) {
      this.buffer.add(node.operator)
    }
    this.recursiveParse(node.argument)
    if (!node.prefix) {
      this.buffer.add(node.operator)
    }
  }
}