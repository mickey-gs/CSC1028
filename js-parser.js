import { Parser } from "./parser.js"

export class JSParser extends Parser {
  constructor() {
    super();
  }

  ExpressionStatement(node) {
    this.parse(node.expression);
    this.buffer += ";\n";
  }
}