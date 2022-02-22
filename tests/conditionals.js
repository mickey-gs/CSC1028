// The transpiler should be able to process conditional statements correctly, including statements with consequent and alternate statements.

function squareOrCube(num) {
    let square = (Math.floor(Math.sqrt(num)) == Math.sqrt(num))
    let cube = (Math.floor(Math.cbrt(num)) == Math.cbrt(num))

    if (square && cube) {
        return "This number is a square and a cube!"
    }
    else if (square) {
        return "This number is a square!"
    }
    else if (cube) {
        return "This number is a cube!"
    }
    else {
        return "This number isn't very interesting."
    }
}

function isEven(num) {
    return (num % 2 == 0 ? 'even' : 'odd')
}

console.log(squareOrCube(64))
console.log(squareOrCube(9))
console.log(squareOrCube(125))
console.log(squareOrCube(37))
console.log(isEven(4))
