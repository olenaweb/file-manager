import command from "./commands.js";
import { EOL, homedir } from "os";
import { env, argv, chdir, cwd, exit } from "process";

try {
  env.username = argv.find((item) => item.includes("--username")).split("=")[1];
  if (!env.username) {
    // throw new Error("Enter your username..." + EOL);
    throw null;
  }
} catch (err) {
  exit();
}

chdir(homedir());

console.log(EOL + `Welcome to the File Manager, ${env.username}!` + EOL);
console.log(`You are currently in ${cwd()} :`);
process.stdin.pipe(command).pipe(process.stdout);

["SIGINT", ".exit"].forEach((item) => {
  process.on(item, () => {
    console.log(`${EOL}Thank you for using File Manager, ${env.username},goodby!`);
    process.exit();
  })
})

