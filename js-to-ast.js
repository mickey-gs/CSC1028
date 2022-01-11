var fs = require("fs");
var contents = fs.readFileSync(process.argv[process.argv.length - 1]).toString();

let acorn = require("acorn");
console.log(acorn.parse(contents, {ecmaVersion: 2020}));
fs.writeFileSync("ast.json", JSON.stringify(acorn.parse(contents, {ecmaVersion: 2020})));
