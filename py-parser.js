import { Parser } from "./parser.js"

export class PyParser extends Parser {
  constructor() {
    super();
  }

  ExpressionStatement(node) {
    this.parse(node.expression);
    this.buffer += "\n";
  }
}