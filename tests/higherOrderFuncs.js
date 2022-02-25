function calculator(a, b, func) {
    return func(a, b)
}

function multiply(a, b) {
    return a * b
}

function exponentiate(a, b) {
    return Math.pow(a, b)
}

console.log(calculator(multiply(2, 5), 5, multiply))