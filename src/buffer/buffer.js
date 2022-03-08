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
    return this;
  }

  dedent() {
    this.#indent -= 1;
    return this;
  }

  replace(remove, str) {
    this.#buffer = this.#buffer.replace(remove, str);
    return this;
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
    return this;
  }

  deleteLines(lines) {
    this.#buffer = this.#buffer.split('\n')
    this.#buffer = this.#buffer.slice(0, this.#buffer.length - (lines + 1)).join('\n')
    this.newline()

    return this
  }

  get() {
    return this.#buffer;
  }
}