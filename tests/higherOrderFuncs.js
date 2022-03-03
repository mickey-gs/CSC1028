function calculator(a, b, func) {
    return func(a, b)
}

function multiply(a, b) {
    return a * b
}

function exponentiate(a, b) {
    return Math.pow(a, b)
}

<<<<<<< HEAD
console.log(calculator(multiply(2, 5), 5, multiply))
console.log(calculator(4 / 2, 1 + 1 + 1, exponentiate))
=======
console.log(calculator(multiply(2, 5), 5, multiply))
>>>>>>> 93dddfaa3078e7b6fc4b19ce73076b0b4cf8d9d5
