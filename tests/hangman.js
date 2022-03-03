import PromptSync from 'prompt-sync'
const prompt = PromptSync()

function hangMan() {
  let guesses = []
  let gameOver = false
  const target = getRandomWord()

  while (!gameOver) {
    guesses.push(getGuess(guesses))

    gameOver = processGuesses(target, guesses)

    displayProgress(target, guesses)
  }

  console.log("Thank you for playing!")
}

function getGuess(guesses) {
  let valid = true
  let guess = ""

  do {
      valid = true
      guess = prompt('->Enter a letter: ')

      if (guess.length !== 1 || !guess.match(/[a-z]/i) || guesses.includes(guess)) {
        valid = false
        console.log("Please enter a single letter that you haven't guessed before.")
      }
  } while (!valid)

  return guess
}

function processGuesses(target, guesses) {
  if (guesses.length == 8) return true

  for (let i = 0; i < target.length; i++) {
    if (!guesses.includes(target[i])) return false
  }

  return true
}

function displayProgress(target, guesses) {
  let dummyWord = '*' * target.length

  for (let i = 0; i < target.length; i++) {
    if (guesses.includes(target[i])) {
      let dummyArray = dummyWord.split('')
      dummyArray[i] = target[i]
      dummyWord = dummyArray.join('')
    }
  }

  console.log("->Letters guessed:")
  console.log(guesses)
  console.log('->Target: ' + dummyWord)

  console.log('->Guesses left: ' + (8 - guesses.length))

  if (guesses.length == 8) {
    console.log("You lose. :(")
    return
  }

  if (dummyWord == target) {
    console.log('You Win! Congratulations!')
  }
}

function getRandomWord() {
  // word chosen randomly by me. This placeholder is used as it is not in the test's scope to choose between a list of genuine random words
  return 'burger'
}

hangMan()