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
    this[node.type](node);
    return this.buffer.get();
  }

  Program(node) {
      for (let i = 0; i != node.body.length; i++) {
        this.parse(node.body[i]);
      }
    }

  ExpressionStatement(node) {
    this.parse(node.expression);
  }

  FunctionDeclaration(node) {
    this.parse(node.id);
    this.buffer.add("(");
    if (node.params.length != 0) {
      this.parse(node.params[0]);
      for (let i = 1; i < node.params.length; i++) {
        this.buffer.add(", ");
        this.parse(node.params[i]);
      }
    }
    this.buffer.add(")");
    this.parse(node.body);
  }

  AssignmentExpression(node) {
    this.parse(node.left);
    this.buffer.add(" ");
    this.buffer.add(node.operator);
    this.buffer.add(" ");
    this.parse(node.right);
  }

  BlockStatement(node) {
    for (let i = 0; i < node.body.length; i++) {
      this.parse(node.body[i]);
    }
  }

  VariableDeclaration(node) {
    for (let i = 0; i < node.declarations.length; i++) {
      this.parse(node.declarations[i]);
    }
  }

  VariableDeclarator(node) {
    this.parse(node.id);
    this.buffer.add(" = ");
    this.parse(node.init);
  }

  ReturnStatement(node) {
    this.parse(node.argument);
  }

  CallExpression(node) {
    this.parse(node.callee);
    this.buffer.add("(");
    if (node.arguments.length > 0) {
      this.parse(node.arguments[0]);
      for (let i = 1; i != node.arguments.length; i++) {
        this.buffer.add(", ");
        this.parse(node.arguments[i])
      }
    }
    this.buffer.add(")");
  }

  MemberExpression(node) {
    this.buffer.add(node.object.name);
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
    this.parse(node.argument);
    if (!(node.prefix)) this.buffer.add(node.operator);
  }

  BinaryExpression(node) {
    if (node.left.type == "BinaryExpression") {
      this.buffer.add("(");
      this.parse(node.left);
      this.buffer.add(")");
    }
    else {
      this.parse(node.left);
    }
    this.buffer.add(" ");
    this.buffer.add(node.operator);
    this.buffer.add(" ");
    if (node.right.type == "BinaryExpression") {
      this.buffer.add("(");
      this.parse(node.right);
      this.buffer.add(")");
    }
    else {
      this.parse(node.right);
    }
  }

  IfStatement(node) {
    this.buffer.add("if ");
    this.parse(node.test);
    this.parse(node.consequent);
    if (node.alternate) {
      this.buffer.add("else ");
      this.parse(node.alternate);
    }
  }

  WhileStatement(node) {
    this.buffer.add("while (");
    this.parse(node.test);
    this.buffer.add(")");
    this.parse(node.body);
  }

  Identifier(node) {
    this.buffer.add(node.name);
  }

  Literal(node) {
    this.buffer.add(JSON.stringify(node.value));
  }

  ArrayExpression(node) {
    this.buffer.add("[");
    if (node.elements.length == 0) {
      this.buffer.add("]");
      return;
    }
    this.parse(node.elements[0]);
    for (let i = 1; i < node.elements.length; i++) {
      this.buffer.add(", ");
      this.parse(node.elements[i]);
    }
    this.buffer.add("]");
  }
}