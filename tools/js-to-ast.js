import * as fs from "fs"
var contents = fs.readFileSync(process.argv[process.argv.length - 1]).toString();

import * as acorn from "acorn"
console.log(JSON.stringify(acorn.parse(contents, {ecmaVersion: 2020})));