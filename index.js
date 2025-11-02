import createCommandManager from "./modules/operations.js";
import { EOL, homedir } from "os";
import { argv, chdir, cwd, exit } from "process";

let username = 'Anonymous';
const args = argv.slice(2);
const usernameArg = args.find(arg => arg.startsWith('--username='));
if (usernameArg) {
  username = usernameArg.split('=')[1];
}

chdir(homedir());

console.log(EOL + `Welcome to the File Manager, ${username}!` + EOL);
console.log(`You are currently in ${cwd()}`);

const commandMan = createCommandManager(username);
process.stdin.pipe(commandMan).pipe(process.stdout);

["SIGINT", "close"].forEach((item) => {
  process.on(item, () => {
    console.log(`${EOL}Thank you for using File Manager, ${username}, goodbye!`);
    exit();
  })
})

