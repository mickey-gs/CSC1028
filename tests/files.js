// This test case covers basic file I/O: writing to, reading from and appending to files.

import * as fs from 'fs'

fs.writeFileSync("output.txt", "Here's some text that I'm going to read later\n")
fs.appendFileSync("output.txt", "And here's some more text")
const contents = fs.readFileSync("output.txt").toString()
console.log(contents)
