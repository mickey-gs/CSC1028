import { toRuby, toPython } from "./index.js"
import * as fs from "fs"
import PromptSync from "prompt-sync"
const prompt = PromptSync()

console.log("There are several test cases available, each of which showcases some of Semantic's functionality. Pick a test case, and its source code will be displayed, followed by its automatically generated equivalents in Python and Ruby.")
const options = ["basics", "arithmetic", "functions", "conditionals", "loops", "higher order functions", "files", "hangman (long test case- a fully functional hangman game)"]
let i = 1
for (const option of options) {
    console.log(`Option ${i}: ${option}`)
    i += 1
}
let valid = true
let choice = ""
do {
    choice = prompt("Which test would you like to run? ") - 0
    valid = (typeof choice === "number") && (Math.floor(choice) == choice) && choice >= 1 && choice <= options.length
} while (!valid)
let contents = ""
if (choice === 6) {
    contents = fs.readFileSync("./tests/higherOrderFuncs.js")
}
else if (choice == 8) {
    contents = fs.readFileSync("./tests/hangman.js")
}
else {
    contents = fs.readFileSync(`./tests/${options[choice - 1]}.js`)
}
console.log("\n************************************")
console.log("Original script:\n" + contents)
console.log("\n************************************")
console.log("Ruby code:\n" + toRuby(contents))
console.log("************************************")
console.log("Python code:\n" + toPython(contents))
