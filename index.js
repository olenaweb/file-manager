import commandMan from "./operations.js";
import { EOL, homedir } from "os";
import { env, argv, chdir, cwd, exit } from "process";

try {
  env.username = argv.find((item) => item.includes("--username")).split("=")[1];
  console.log('env.username = ', env.username);
  if (!env.username) {
    // throw new Error("Enter your username..." + EOL);
    throw null;
  }
} catch (err) {
  console.log(err.message);
  exit();
}

chdir(homedir());

console.log(EOL + `Welcome to the File Manager, ${env.username}!` + EOL);
console.log(`You are currently in ${cwd()}...`);
process.stdin.pipe(commandMan).pipe(process.stdout);

["SIGINT", "close"].forEach((item) => {
  process.on(item, () => {
    console.log(`${EOL}Thank you for using File Manager, ${env.username} , goodby!`);
    process.exit();
  })
})

