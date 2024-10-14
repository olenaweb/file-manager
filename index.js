import commandMan from "./modules/operations.js";
import { EOL, homedir } from "os";
import { argv, chdir, cwd, exit } from "process";
let username;
try {
  if (argv.length >= 3) {
    username = argv.find((item) => item.includes("--username")).split("=")[1];
  }
  if (!username || username === undefined) {
    username = 'user';
  }
} catch (err) {
  console.log(err.message);
}

chdir(homedir());

console.log(EOL + `Welcome to the File Manager, ${username}!` + EOL);
console.log(`***You are currently in ${cwd()}...`);
process.stdout.write(EOL + "> ");
process.stdin.pipe(commandMan).pipe(process.stdout);

["SIGINT", "close"].forEach((item) => {
  process.on(item, () => {
    console.log(`${EOL}Thank you for using File Manager, ${username} , goodby!`);
    exit();
  })
})

