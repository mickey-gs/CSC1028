// The transpiler should be able to correctly generate functions in the target language. Many of the later benchmarks rely on function notation, so this is an important step.

function add(num1, num2) {
    return num1 + num2 
}

function printValue(value) {
    console.log(value)
}

printValue(50)
console.log(add(10, 20))
