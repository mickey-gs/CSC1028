import { TranspilerSuper } from "../transpiler-super/transpiler-super.js";

/*

This class is the transpiler that targets Ruby. Its role is to translate an AST into correct Ruby source code. For a general overview of the theory behind this transpiler's design, see the top comment on the superclass at src/transpiler-super/transpiler-super.js

*/

export class RubyTranspiler extends TranspilerSuper {
  corrections;

  constructor() {
    super();

    // keywords that do not exist in Ruby, and their correct Ruby equivalents. Used in the correct() method
    this.corrections = {
      "else if": "elsif",
      "console.log": "puts",
      "!==": "!=",
      "includes": "include?"
    }
  }

  parse(node) {
    const code = this.recursiveParse(node)
    return this.correct(code)
  }

  // While the source code generated has correct Ruby syntax, there are still some potential areas where the code will not be correct. For example, a call to a function that only exists in the node.js API, such as 'console.log(foo)'. The purpose of this method is to replace all such instances of incorrect code with the correct Ruby equivalent using regular expressions. Each replacement has an explanation of what it is targeting above it.
  correct(code) {
    for (const key of Object.keys(this.corrections)) {
      code = code.replace(new RegExp(key, 'gmi'), this.corrections[key]);
    }

    // replace JS floor function for rounding decimals
    let regex = /Math.floor\((.+)\)/gm
    code = code.replace(regex, '($1).floor');

    // recognise all functions that take functions as parameters, storing which parameter is a function
    let higherOrderFuncs = {}
    code = code.replace(/def (\w+)\(.+\)\n(.+\n)+/gmi, (def, $1) => {
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
      let args = $1.split(' + ')

      for (let i = 0; i < args.length; i++) {
        if (args[i][0] != '\'' && args[i][0] != '"') {
          args[i] = '(' + args[i] + ').to_s'
        }
      }

      return 'puts(' + args.join(' + ') + ')\n'
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

    return code
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
}