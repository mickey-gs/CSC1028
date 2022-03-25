// These test cases cover loops, recursion and arrays.

function mean(array) {
    let i = 0
    let sum = 0
    while (i < array.length) {
        sum += array[i]
        i += 1
    }
    return sum / array.length
}

function sum(array) {
    let sum = 0
    for (let i = 0; i < array.length; i++) {
        sum += array[i]
    }

    return sum
}

function factorial(integer) {
    if (integer == 1 || integer == 0) return 1

    return integer * factorial(integer - 1) 
}

console.log('The mean of the numbers 1 to 10: ' + mean([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
console.log('The sum of the numbers 1 to 10: ' + sum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
console.log('10 factorial: ' + factorial(10))
