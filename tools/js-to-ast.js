import * as fs from 'fs'
import * as acorn from 'acorn'

if (process.argv.length == 2) {
    console.log('Please provide a file for converstion to AST.')
}
else if (process.argv.length == 3) {
    console.log('Pleas provide a path for the output file.')
}
else if (process.argv.length >= 4) {
    const sourceCode = fs.readFileSync(process.argv[2])
    let ast = JSON.stringify(acorn.parse(sourceCode, {ecmaVersion: 2020}))
    ast = ast.replace(/,/gmi, ',\n')
    ast += '\n'
    fs.writeFileSync(process.argv[3], ast)
    console.log('AST successfully written to ' + process.argv[3])
}
