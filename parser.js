export class Parser {
  buffer;

  constructor() {
    this.buffer = "";
  }

  parse(node) {
    this[node.type](node);
    return this.buffer;
  }

  Program(node) {
      for (let i = 0; i != node.body.length; i++) {
        this.parse(node.body[i]);
      }
    }

  ExpressionStatement(node) {
    this.parse(node.expression);
  }

  AssignmentExpression(node) {
    this.parse(node.left);
    this.buffer += " " + node.operator + " ";
    this.parse(node.right);
  }

  CallExpression(node) {
    this.parse(node.callee);
    // console.log(node.arguments[0]);
    this.buffer += "(";
    this.parse(node.arguments[0]);
    for (let i = 1; i != node.arguments.length; i++) {
      this.buffer += ", ";
      this.parse(node.arguments[i])
    }
    this.buffer += ")";
  }

  MemberExpression(node) {
    this.buffer += node.object.name;
    this.buffer += ".";
    this.buffer += node.property.name;
  }

  BinaryExpression(node) {
    if (node.left.type != "Literal") {
      this.buffer += "(";
      this.parse(node.left);
      this.buffer += ")";
    }
    else {
      this.parse(node.left);
    }
    this.buffer += " " + node.operator + " ";
    if (node.right.type != "Literal") {
      this.buffer += "(";
      this.parse(node.right);
      this.buffer += ")";
    }
    else {
      this.parse(node.right);
    }
  }

  Identifier(node) {
    this.buffer += node.name;
  }

  Literal(node) {
    this.buffer += JSON.stringify(node.value);
  }
}