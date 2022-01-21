const path = "output.js";
const fs = require("fs");

fs.writeFileSync(path, "");

function parse(node) {
  // console.log(JSON.stringify(node)); 
  // console.log(node.expression); 
  switch (node.type) {
    case "Program":
      for (let i = 0; i != node.body.length; i++) {
        parse(node.body[i]);
      }
      break;

    case "ExpressionStatement":
      parse(node.expression);
      fs.appendFileSync(path, ";\n");
      break;

    case "CallExpression":
      parse(node.callee);
      // console.log(node.arguments[0]);
      fs.appendFileSync(path, "(");
      parse(node.arguments[0]);
      for (let i = 1; i != node.arguments.length; i++) {
        fs.appendFileSync(path, ", ");
        parse(node.arguments[i])
      }
      fs.appendFileSync(path, ")");
      break;

    case "MemberExpression":
      fs.appendFileSync(path, node.object.name);
      fs.appendFileSync(path, ".");
      fs.appendFileSync(path, node.property.name);
      break;

    case "BinaryExpression":
      if (node.left.type != "Literal") {
        fs.appendFileSync(path, "(");
        parse(node.left);
        fs.appendFileSync(path, ")");
      }
      else {
        parse(node.left);
      }
      fs.appendFileSync(path, " " + node.operator + " ");
      if (node.right.type != "Literal") {
        fs.appendFileSync(path, "(");
        parse(node.right);
        fs.appendFileSync(path, ")");
      }
      else {
        parse(node.right);
      }
      break;

    case "Literal":
      fs.appendFileSync(path, JSON.stringify(node.value));
      break;
  }
}

module.exports = { parse };