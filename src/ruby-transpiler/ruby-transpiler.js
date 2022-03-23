import { TranspilerSuper } from "../transpiler-super/transpiler-super.js";
import * as fs from "fs";

export class RubyTranspiler extends TranspilerSuper {
  corrections;
  staticMethods;
  addingStrings;

  constructor() {
    super();
    this.corrections = {
      "else if": "elsif",
      "console.log": "puts",
      "!==": "!=",
      "includes": "include?"
    }
    this.staticMethods = []
    this.addingStrings = false
  }

  parse(node) {
    const code = this.recursiveParse(node)
    return this.correct(code)
  }

  correct(code) {
    for (const key of Object.keys(this.corrections)) {
      code = code.replace(new RegExp(key, 'gmi'), this.corrections[key]);
    }

    // replace JS floor function for rounding decimals
    let regex = /Math.floor\((.+)\)/gm
    code = code.replace(regex, '($1).floor');

    // recognise all functions that take functions as parameters, storing which parameter is a function
    let higherOrderFuncs = {}
    code = code.replace(/def.*?end/gmis, (def, $1) => {
        let funcDeclaration = def.matchAll(/def \w+\((.+)\)/gmi)
        for (const parameterList of funcDeclaration) {
          let params = parameterList[1].matchAll(/([^\s,]+\(.+?\))|([^\s,]+)/gmi)
          
          let pos = 0
          for (const param of params) {
            if (def.indexOf(param[0] + '\(') != -1) {
                def = def.replace(param[0] + '(', param[0] + '.call(')
                higherOrderFuncs[$1] = pos
            }
            pos++
          }
        }

        return def
    })

    // for all calls of higher order functions, wrap any parameter functions in the correct syntax
    for (const func of Object.keys(higherOrderFuncs)) {
      function replacer(param) {
        if (typeof(replacer.i) == 'undefined') {
          replacer.i = -1
        }
        replacer.i += 1

        if (replacer.i == higherOrderFuncs[func]) {
          return 'method(:' + param + ')'
        }

        return param
      }

      code = code.replace(new RegExp(`(.*(?<!def\\s)${func}\\()(([^()]+(\\([^()]+\\))?(,\\s)?)+)(\\).+)`, 'gmi'), (match, preceding, params, opt1, opt2, opt3, following) => {
        return preceding + params.replace(/\w+(\(.+\))?/gmi, replacer) + following
      })
    }

    // Ruby does not have an increment operator
    regex = /(\w+)\+\+/gmi
    code = code.replace(regex, '$1 += 1')

    // replace calls to console.log
    code = code.replace(/puts\((.+)\)\n/gmi, (input, $1) => {
      return 'puts(' + $1 + ')\n'
    })

    // replace calls to prompt
    code = code.replace(/(\w+) = prompt\((.+)\)/gmi, (match, variable, param) => {
      return 'puts ' + param + '\n' + variable + ' = gets.chomp'
    })

    // import statements haven't been handled yet, so there are replaced with a placeholder that gets automatically deleted
    code = code.replace(/^.*@DELETE@.*$/gmi, (match) => {
      return ''
    })

    // code only valid in JS
    code = code.replace(/^.+PromptSync.*$/gmi, '')

    // replace JS file I/O calls with Ruby ones 

    code = code.replace(/fs\.writeFileSync\((.+),\s(.+)\)/gmi, (match, file, content) => {
      return "File.open(" + file + ", 'w') { |file| file.print(" + content + ") }"
    })

    code = code.replace(/fs\.appendFileSync\((.+),\s(.+)\)/gmi, (match, file, content) => {
      return "File.open(" + file + ", 'a') { |file| file.print(" + content + ") }"
    })

    code = code.replace(/fs\.readFileSync\((.+)\)\.toString\(\)/gmi, (match, file, content) => {
      return "File.open(" + file + ", 'r').read()"
    })

    // replace calls to Math.pow with the exponentiation operator (**)
    code = code.replace(/Math.pow\(([^,]+),\s([^,]+)\)/gmi, (match, param1, param2) => {
      return `(${param1}) ** (${param2})`
    })

    //replace how JS accesses instance variables (this.var) with how Ruby accesses them (@var)
    code = code.replace(/this\.([^\s\(]+)([\s\)])/gm, (match, variable, ending) => {
      return `@${variable}${ending}`
    })

    // removes cases where the "self" keyword has been accidentally duplicated
    code = code.replace(/self\.self/gmi, "self")

    // in Ruby, calling super() automatically call's the superclass's method of the same name. therefore, all cases of "super.someMethod()" are replaced with "super()"
    code = code.replace(/super\.\w+\((.*)\)/gmi, (match, params) => {
      return "super(" + params + ")"
    })

    return code
  }

  Identifier(node) {
    if (this.staticMethods.includes(node.name)) {
      this.buffer.add("self.")
    }
    this.buffer.add(node.name);
  }

  BinaryExpression(node) {
    if (node.left.type == "BinaryExpression") {
      this.buffer.add("(");
      this.recursiveParse(node.left);
      this.buffer.add(")");
    }
    else {
      this.recursiveParse(node.left);
    }
    if (node.operator == "+" && node.right.type == "StringLiteral" && node.left.type != "StringLiteral") {
      this.buffer.add(".to_s")
    }
    
    this.buffer.add(" ");
    this.buffer.add(node.operator);
    this.buffer.add(" ");

    if (node.right.type == "BinaryExpression") {
      this.buffer.add("(");
      this.recursiveParse(node.right);
      this.buffer.add(")");
    }
    else {
      this.recursiveParse(node.right);
    }

    if (node.operator == "+" && node.left.type == "StringLiteral" && node.right.type != "StringLiteral") {
      this.buffer.add(".to_s")
    }
  }

  ExpressionStatement(node) {
    super.ExpressionStatement(node);
    this.buffer.newline();
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

  IfStatement(node) {
    this.buffer.add("if ");
    this.recursiveParse(node.test);
    
    if (node.consequent.type != 'BlockStatement') {
      let tempNode = {type: 'ReturnStatement'}
      Object.assign(tempNode, node.consequent)
      node.consequent.type = 'BlockStatement'
      node.consequent.body = [tempNode]
      this.recursiveParse(node.consequent)
    }
    else {
      this.recursiveParse(node.consequent);
    }
    
    if (node.alternate) {
      this.buffer.deleteLines(1);
      this.buffer.add("else ");
      this.recursiveParse(node.alternate);
    }
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
    this.buffer.add('loop do')
    this.recursiveParse(node.body)
    this.buffer.deleteLines(1)
    this.buffer.add(' break unless (')
    this.recursiveParse(node.test)
    this.buffer.add(') ').newline()
    this.buffer.add('end')
    this.buffer.newline()
  }

  ClassDeclaration(node) {
    this.staticMethods = []
    this.buffer.add("class ");
    this.recursiveParse(node.id);
    if (node.superClass) {
      this.buffer.add(" < ")
      this.recursiveParse(node.superClass)
    }

    for (let i = 0; i < node.body.body.length; i++) {
      const elem = node.body.body[i]
      if (elem.type == "ClassMethod" && elem.static) {
        this.staticMethods.push(elem.key.name)
      }
    }
    this.recursiveParse(node.body);
  }

  ClassMethod(node) {
    this.buffer.add("def ")
    if (node.static) {
      this.buffer.add("self.")
    }

    if (node.key.name == "constructor") {
      node.key.name = "initialize"
    }

    super.ClassMethod(node)
  }

  ClassProperty(node) {
    if (node.static) {
      this.buffer.add("@")
    }
    this.buffer.add("@")
    this.recursiveParse(node.key)
    this.buffer.newline()
  }

  NewExpression(node) {
    this.recursiveParse(node.callee)
    this.buffer.add(".new(")
    if (node.arguments.length >= 1) {
      this.recursiveParse(node.arguments[0])
      for (let i = 1; i < node.arguments.length; i++) {
        this.buffer.add(", ")
        this.recursiveParse(node.arguments[i])
      }
    }
    this.buffer.add(")")
  }

  CallExpression(node) {
    if (node.callee.type == "MemberExpression" && node.callee.object.type == "ThisExpression") {
      this.recursiveParse(node.callee.property)
    }
    else {
      this.recursiveParse(node.callee);
    }
    this.buffer.add("(");
    if (node.arguments.length > 0) {
      this.recursiveParse(node.arguments[0]);
      for (let i = 1; i != node.arguments.length; i++) {
        this.buffer.add(", ");
        this.recursiveParse(node.arguments[i])
      }
    }
    this.buffer.add(")");
  }
}