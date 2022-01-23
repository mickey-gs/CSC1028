export class Buffer {
  #buffer;
  #indent;

  constructor() {
    this.#buffer = "";
    this.#indent = 0;
  }

  add(str) {
    this.#buffer += str;
    return this;
  }

  newline() {
    this.#buffer += "\n" + "  ".repeat(this.#indent);
    return this;
  }

  indent() {
    this.#indent += 1;
  }

  dedent() {
    this.#indent -= 1;
  }

  trim() {
    let temp = this.#buffer.split("");
    let i = temp.length - 1;
    while (true) {
      if (temp[i] == " " || temp[i] == "\n") {
        i -= 1;
      }
      else {
        break;
      }
    }
    temp = temp.slice(0, i + 1);
    this.#buffer = temp.join("");
  }

  get() {
    return this.#buffer;
  }
}