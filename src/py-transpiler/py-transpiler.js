import { TranspilerSuper } from "../transpiler-super/transpiler-super.js"
import * as fs from "fs"
import { match } from "assert";

export class PyTranspiler extends TranspilerSuper {
  corrections;
  
  constructor() {
    super();
    this.corrections = {
      "true": "True",
      "false": "False",
      "else if": "elif",
      "console.log": "print",
      "&&": "and",
      "||": "or",
      "Math": "math",
      "!==": "!=",
      ".push(": ".append(",
      "prompt": "input",
      "imports": [
        "math",
        "numpy"
      ] 
    };
  }

  parse(node) {
    const code = this.recursiveParse(node)
    return this.correct(code)
  }

  recursiveParse(node) {
    this[node.type](node);
    return this.buffer.get();
  }

  correct(code) {
    for (let key of Object.keys(this.corrections)) {
      code = code.replaceAll(key, this.corrections[key]);
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

    code = code.replace(/([^\w])!(?!=)(.+\s)/gmi, (match, preceding, operand) => {
      return preceding + ' not ' + operand
    })

    let isRegex = false
    let reg = ""
    code = code.replace(/(\w+)\.match\(\/(.+)\/(\w+)\)/gmi, (match, arg, regex, tags) => {
      isRegex = true
      reg = regex
      return 'regex.match(' + arg + ')'
    })
    if (isRegex) {
      code = 'import re\n\nregex = re.compile("' + reg + '")\n' + code
    }

    code = code.replace(/(\w+).split\(""\)/gmi, (match, arg) => {
      return 'list(' + arg + ')'
    })

    code = code.replace(/(\w+).join\((.+)\)/gmi, (match, arg, joiner) => {
      return joiner + '.join(' + arg + ')'
    })

    code = code.replace(/(\w+).includes\((.+)\)/gmi, (match, callee, arg) => {
      return arg + ' in ' + callee
    })

    code = code.replace(/^.*@DELETE@.*$/gmi, (match) => {
      return ''
    })

    code = code.replace(/^.+PromptSync.*$/gmi, '')

    code = code.replace(/fs\.writeFileSync\((.+),\s(.+)\)/gmi, (match, file, content) => {
      return "open(" + file + ", 'w').write(" + content + ")"
    })

    code = code.replace(/fs\.appendFileSync\((.+),\s(.+)\)/gmi, (match, file, content) => {
      return "open(" + file + ", 'a').write(" + content + ")"
    })

    code = code.replace(/fs\.readFileSync\((.+)\)\.toString\(\)/gmi, (match, file, content) => {
      return "open(" + file + ", 'r').read()"
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

  DoWhileStatement(node) {
    this.buffer.add('while True')
    this.recursiveParse(node.body)
    this.buffer.trim()
    this.buffer.indent()
    this.buffer.newline()
    this.buffer.add('if not (')
    this.recursiveParse(node.test)
    this.buffer.add('):')
    this.buffer.indent()
    this.buffer.newline()
    this.buffer.add('break')
    this.buffer.dedent()
    this.buffer.dedent()
    this.buffer.newline()
    this.buffer.newline()
  }
}