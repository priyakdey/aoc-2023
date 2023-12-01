const fs = require("fs");
const readline = require("readline");

function readFileInMemory(filepath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const readInterface = readline.createInterface({
      input: fs.createReadStream(filepath),
      output: process.stdout,
      terminal: false,
    });

    const buffer: string[] = [];

    // callback when a new line is encountered, `line` is an event which is emitted when new line is encountered.
    readInterface.on("line", (line: string) => buffer.push(line));

    // callback when file handle is closed.
    readInterface.on("close", () => {
      console.log("Finished reading the file");
      resolve(buffer);
    });

    readInterface.on("error", (error: Error) => {
      console.error(`ERROR: Could not read file because of ${error}`);
      reject(error);
    });
  });
}

function toNumber(line: string): number {
  let num = 0;
  for (let i = 0; i < line.length; i++) {
    const codePoint = line.charCodeAt(i);
    if (codePoint >= 48 && codePoint <= 57) {
      num += 10 * (codePoint - 48);
      break;
    }
  }

  for (let i = line.length - 1; i >= 0; i--) {
    const codePoint = line.charCodeAt(i);
    if (codePoint >= 48 && codePoint <= 57) {
      num += codePoint - 48;
      break;
    }
  }

  return num;
}

async function main() {
  const args = process.argv;
  const scriptName = args[1];

  if (args.length <= 2) {
    throw new Error(`USAGE: ./${scriptName} <input file name>`);
  }

  const filepath = args[2];
  const lines = await readFileInMemory(filepath);

  const total = lines
    .map((line: string) => toNumber(line))
    .reduce(
      (accumulator: number, currValue: number) => accumulator + currValue,
      0
    );

  console.log(total);
}

main();
