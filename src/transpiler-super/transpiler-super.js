import { Buffer } from "../buffer/buffer.js"

export class TranspilerSuper {
  buffer;

  constructor() {
    this.buffer = new Buffer;
  }

  clear() {
    this.buffer = new Buffer;
  }

  parse(node) {
    return this.recursiveParse(node)
  }

  recursiveParse(node) {
    this[node.type](node);
    return this.buffer.get();
  }

  File(node) {
    this.recursiveParse(node.program);
  }

  Program(node) {
    for (let i = 0; i != node.body.length; i++) {
      this.recursiveParse(node.body[i]);
    }
  }

  StringLiteral(node) {
    this.buffer.add(node.extra.raw)
  }

  ExpressionStatement(node) {
    this.recursiveParse(node.expression);
  }

  ImportDeclaration(node) {
    this.buffer.add('@DELETE@\n')
  }

  FunctionDeclaration(node) {
    this.recursiveParse(node.id);
    this.buffer.add("(");
    if (node.params.length != 0) {
      this.recursiveParse(node.params[0]);
      for (let i = 1; i < node.params.length; i++) {
        this.buffer.add(", ");
        this.recursiveParse(node.params[i]);
      }
    }
    this.buffer.add(")");
    this.recursiveParse(node.body);
    this.buffer.newline()
  }

  AssignmentExpression(node) {
    this.recursiveParse(node.left);
    this.buffer.add(" ");
    this.buffer.add(node.operator);
    this.buffer.add(" ");
    this.recursiveParse(node.right);
  }

  BlockStatement(node) {
    for (let i = 0; i < node.body.length; i++) {
      this.recursiveParse(node.body[i]);
    }
  }

  VariableDeclaration(node) {
    for (let i = 0; i < node.declarations.length; i++) {
      this.recursiveParse(node.declarations[i]);
    }
  }

  VariableDeclarator(node) {
    this.recursiveParse(node.id);
    if (node.init) {
      this.buffer.add(" = ");
      this.recursiveParse(node.init);
    }
  }

  ReturnStatement(node) {
    if (node.argument) {
      this.recursiveParse(node.argument);
    }
  }

  CallExpression(node) {
    this.recursiveParse(node.callee);
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

  MemberExpression(node) {
    if (node.object.name) {
      this.buffer.add(node.object.name);
    }
    else {
      this.recursiveParse(node.object)
    }
    if (node.computed) {
      this.buffer.add("[");
      this.buffer.add(node.property.name);
      this.buffer.add("]");
    }
    else {
      this.buffer.add(".");
      this.buffer.add(node.property.name);
    }
  }

  UnaryExpression(node) {
    if (node.prefix) this.buffer.add(node.operator);
    this.recursiveParse(node.argument);
    if (!(node.prefix)) this.buffer.add(node.operator);
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
  }

  ConditionalExpression(node) {
    this.buffer.add("(");
    this.recursiveParse(node.test);
    this.buffer.add(" ? ");
    this.recursiveParse(node.consequent);
    this.buffer.add(" : ");
    this.recursiveParse(node.alternate);
    this.buffer.add(")");
  }

  LogicalExpression(node) {
    this.recursiveParse(node.left);
    this.buffer.add(' ' + node.operator + ' ');
    this.recursiveParse(node.right);
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
      this.buffer.add("else ");
      this.recursiveParse(node.alternate);
    }
  }

  WhileStatement(node) {
    this.buffer.add("while (");
    this.recursiveParse(node.test);
    this.buffer.add(")");
    this.recursiveParse(node.body);
  }

  DoWhileStatement(node) {
    this.buffer.add('do')
    this.recursiveParse(node.body)
    this.buffer.trim()
    this.buffer.add(' while (')
    this.recursiveParse(node.test)
    this.buffer.add(') ').newline()
  }

  ForStatement(node) {
    this.buffer.add('for (')
    this.recursiveParse(node.init)
    this.buffer.trim()
    this.buffer.add(' ')
    this.recursiveParse(node.test)
    this.buffer.add('; ')
    this.recursiveParse(node.update)
    this.buffer.add(')')
    this.recursiveParse(node.body)
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

  Identifier(node) {
    this.buffer.add(node.name);
  }

  Literal(node) {
    if (node.regex) {
      this.buffer.add(node.raw)
    }
    else {
      this.buffer.add(JSON.stringify(node.value));    
    }
  }

  ArrayExpression(node) {
    this.buffer.add("[");
    if (node.elements.length == 0) {
      this.buffer.add("]");
      return;
    }
    this.recursiveParse(node.elements[0]);
    for (let i = 1; i < node.elements.length; i++) {
      this.buffer.add(", ");
      this.recursiveParse(node.elements[i]);
    }
    this.buffer.add("]");
  }

  ClassDeclaration(node) {
    this.buffer.add("class ");
    this.recursiveParse(node.id);
    this.recursiveParse(node.body);
  }

  ClassBody(node) {
    this.BlockStatement(node);
  }

  ClassMethod(node) {
    console.log(node)
    this.recursiveParse(node.key)
    this.buffer.add("(")
    if (node.params.length >= 1) {
      this.recursiveParse(node.params[0])
      for (let i = 1; i < node.params.length; i++) {
        this.buffer.add(", ")
        this.recursiveParse(node.params[i])
      }
    }
    this.buffer.add(")")
    this.recursiveParse(node.body)
    this.buffer.newline()
  }
}